import redis, os
from pkg.cache import Cache

cache_connection = Cache()

def get_cache():
    return cache_connection

def init():
    host = os.environ.get('REDIS_HOST', 'localhost')
    port = os.environ.get('REDIS_PORT', 6379)
    password = os.environ.get('REDIS_PASSWORD', '')
    db = os.environ.get('REDIS_DB', 0)
    
    r = redis.Redis(host=host,password=password, port=port, db=db)
    cache_connection.init(r)
    
