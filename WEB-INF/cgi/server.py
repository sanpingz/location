#!/usr/bin/env python
__author__ = 'sanpingz'

import SocketServer
from xml.dom.minidom import parseString

def value(xml):
    dom = parseString(xml)
    node = dom and dom.getElementsByTagName('currentLocation')[0].childNodes
    latitude = node[1].firstChild.data
    longitude = node[3].firstChild.data
    return dict(latitude=latitude, longitude=longitude)

class RequestHandler(SocketServer.StreamRequestHandler):
    def handle(self):
        flag = True
        while flag:
            xml = self.rfile.read()
            flag = len(xml)
            if flag:
                print xml
                self.wfile.write('response: '+xml + '\n');

if __name__ == '__main__':
    import sys
    host, port = '135.252.143.60', 8989
    print 'socket server is running'
    server = SocketServer.ThreadingTCPServer((host,port), RequestHandler)
    server.serve_forever()
