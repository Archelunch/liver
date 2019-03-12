# chat/consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
from quiz.models import Quiz, Category, Progress, Sitting, Question, QuizProgress, QUser
from mcq.models import MCQQuestion, Answer
import json

class QuizConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.url = self.scope['url_route']['kwargs']['url']
        self.quiz = Quiz.objects.filter(url=self.url).first()
        self.quser = None
        self.nickname = None
        self.quiz_group_name = self.quiz.title
        self.question_count = len(self.quiz.question_set.all())
        self.master_mode = False
        # Join room group
        await self.channel_layer.group_add(
            self.quiz_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        if self.quser:
            self.quser.is_online = False
            self.quser.save()
            data={
                'type': 'chat_message',
                "message": "player_count",
                "count": QUser.objects.filter(quiz=self.quiz, is_online=True).count()
            }
            await self.channel_layer.group_send(
                self.quiz_group_name,
                data
            )
        # Leave room group
        await self.channel_layer.group_discard(
            self.quiz_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        data = {
            'type': 'chat_message',
            'message': ""
        }

        if message == 'question':
            if self.master_mode == False:
                self.quiz_manager = QuizProgress.objects.new_sitting(self.quiz)
                self.master_mode = True
                self.question_number = 0
            self.question = self.quiz_manager.get_first_question()
            if self.question != False:
                self.question_number+=1
                data = {
                        'type': 'chat_message',
                        "message": "question",
                        "question_id": self.question.id,
                        "questionText": str(self.question),
                        "questionNumber": self.question_number, # номер текущего вопроса
                        "questionCount": len(self.quiz_manager._question_ids()), # количество вопросов
                        "answers": [str(ans) for ans in self.question.get_answers()],
                        "ids": [ans.id for ans in self.question.get_answers()]
                }
            else:
                data = {
                    'type': 'chat_message',
                    "message": "stop_quiz"
                }
        elif message == 'question_results':
            all_people = sum([ans.people_count for ans in self.question.get_answers()])
            if all_people > 0:
                percent = [int(100.0*ans.people_count/all_people) for ans in self.question.get_answers()]
            else:
                percent = [0 for ans in self.question.get_answers()]
            data = {
                    'type': 'chat_message',
                	"message": "question_results",
                    "results": [{"right":ans.correct, "percent":percent[ind], "text":str(ans)} for ind, ans in enumerate(self.question.get_answers())]
            }
            self.quiz_manager.remove_first_question()
        elif message == 'results':
            data={
                'type': 'chat_message',
                'message': 'results'
            }

        elif message == 'new_user':
            self.nickname = text_data_json['name']
            data={
                'type': 'chat_message',
                "message": "player_count",
                "count": QUser.objects.filter(quiz=self.quiz, is_online=True).count()
                }

        elif message == 'answer':
            if self.master_mode == False:
                self.quser = QUser.objects.filter(id=text_data_json['name'], quiz=self.quiz).first()
                question = MCQQuestion.objects.filter(id=text_data_json['question_id']).first()
                self.is_correct = question.check_if_correct(text_data_json['answer'])
                self.quser.add_time(text_data_json['time'])
                if self.is_correct is True:
                    self.quser.add_to_score(1)
                self.quser.add_user_answer(question, text_data_json['answer'])
                data={
                    'type': 'chat_message',
                	"message": "200.ok"
                    }

        if message == 'start':
            self.quiz.is_started = True
            self.quiz.save()

        if message == 'finish':
            self.quiz.is_started = False
            self.quiz.save()

        # Send message to room group
        await self.channel_layer.group_send(
            self.quiz_group_name,
            data
        )

    # Receive message from room group
    async def chat_message(self, event):
        if event['message'] == "question" or event['message'] == "question_results":
            if self.nickname == None:
                event['status'] = "watcher"
            else:
                event['status'] = "player"
        if event['message'] == "results":
            if self.master_mode == False:
                if self.quser is not None:
                    event = {
                        "type": 'chat_message',
                        "message": "results",
                        "correctAnswersCount": self.quser.get_score,
                        "questionCount": self.question_count
                    }
                else:
                    event = {
                        "type": 'chat_message',
                        "message": "results",
                        "correctAnswersCount": 0,
                        "questionCount": self.question_count
                    }
        await self.send(text_data=json.dumps(event))