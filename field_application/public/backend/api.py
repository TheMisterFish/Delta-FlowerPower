from werkzeug.wrappers import Request, Response
from werkzeug.serving import run_simple

from jsonrpc import JSONRPCResponseManager, dispatcher

import sys

print("runnaman", flush=True)


@dispatcher.add_method
def foobar(**kwargs):
    return kwargs["foo"] + kwargs["bar"]


@Request.application
def application(request):
    # Dispatcher is dictionary {<method_name>: callable}
    dispatcher["echo"] = lambda s: s
    dispatcher["add"] = lambda a, b: a + b

    response = JSONRPCResponseManager.handle(
        request.get_data(cache=False, as_text=True), dispatcher)
    return Response(response.json, mimetype='application/json')


if __name__ == '__main__':
    print("I AM RUNNING!", flush=True)
    run_simple('localhost', 4242, application)


# from __future__ import print_function
# from yolov5 import simple_detect as detect
# import sys

# class Router(object):
#     def calc(self, text):
#         """based on the input text, return the int result"""
#         try:
#             return detect.test()
#         except Exception as e:
#             return 0.0
#     def echo(self, text):
#         """echo any text"""
#         return text

# def parse_port():
#     port = 4242
#     try:
#         port = int(sys.argv[1])
#     except Exception as e:
#         pass
#     return '{}'.format(port)

# def main():
#     addr = 'tcp://127.0.0.1:' + parse_port()
#     s = zerorpc.Server(Router())
#     s.bind(addr)
#     print('start running on {}'.format(addr))
#     s.run()

# if __name__ == '__main__':
#     main()
