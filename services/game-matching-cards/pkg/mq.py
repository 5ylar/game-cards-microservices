import pika


class MessageQueue:
    def init(self, connection: pika.BlockingConnection = None, queue = []):
        self.connection = connection
        self.channel = self.connection.channel()              # start a channel
        
        for q in queue:
            self.channel.queue_declare(queue=q)               # Declare a queue

        print("init")
        
    def publish(self, exchange='', key='', body=''):
        self.channel.basic_publish(exchange=exchange, routing_key=key, body=body)
        
    def close(self):
        self.connection.close()
        print("closed")

    def ping(self):
        self.connection.heartbest_check

