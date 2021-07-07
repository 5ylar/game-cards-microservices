
import pika, os
from pkg.mq import MessageQueue


mq = MessageQueue()

def get_mq():
    return mq

def init():
    host = os.environ.get('RABBITMQ_HOST', 'localhost')
    port = os.environ.get('RABBITMQ_PORT', 5672)
    user = os.environ.get('RABBITMQ_USER', '')
    password = os.environ.get('RABBITMQ_PASSWORD', '')
    
    credentials = pika.PlainCredentials(user, password)
    parameters = pika.ConnectionParameters(host, port,'/',credentials, heartbeat=0)
    connection = pika.BlockingConnection(parameters)
    connection.consumer_cancel_notify
    mq.init(connection, ["match_result"])

def close():
    mq.close()
