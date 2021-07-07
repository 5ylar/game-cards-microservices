import redis

import exception.exception


class Cache:
    def init(self, r = redis.Redis(host='localhost', port=6379, db=0)):
        self.r = r

    def get(self, key):
        val = self.r.get(key)
        
        if val is None:
            raise exception.exception.err_not_found
            
        return val.decode()
    
    def set(self, key, val, ex=60):
        return self.r.set(key, val, ex)

    def delete(self, key):
        self.r.delete(key)

    def pipeline(self) -> redis.client.Pipeline:
        return self.r.pipeline()

    def ping(self):
        return self.r.ping()