#!/usr/bin/env python
# -*- coding: UTF-8 -*-
__author__ = 'sanpingz'

from xml.dom.minidom import parseString
import cgi, urllib2
from common import *

print 'Content-type: application/json'
print

def value(xml):
    dom = parseString(xml)
    node = dom and dom.getElementsByTagName('currentLocation')[0].childNodes
    latitude = node[1].firstChild.data
    longitude = node[3].firstChild.data
    d = dict(latitude=latitude, longitude=longitude)
    return json_dumps(d)

def post(addr, rank, url = qos_url):
    params = dict(address=addr, qosRank=rank)
    headers = {"Content-type": "application/xml", "Accept": "application/xml"}
    data = qos_xml % params
    req = urllib2.Request(url, data, headers)
    #code = 500
    #msg = 'Unexpected error'
    try:
        cb = urllib2.urlopen(req)
        code = cb.code
        msg = str(cb.msg)
    except urllib2.HTTPError, e:
        code = e.code
        msg = str(e.msg)
    res = dict(code=code, msg = msg)
    if code!=200:
        if str(code) in http_code.keys():
            res['msg'] = http_code[str(code)]
        else:
            res['msg'] = 'Unexpected error'
    return json_dumps(res)

form = cgi.FieldStorage()
addr = form.getvalue('address')
rank = form.getvalue('qosRank')
if addr and rank:
    print post(addr, rank)
else:
    print ''

if __name__ == '__main__': pass
    #d = {'latitude': u'300.0', 'longitude': u'3000.0'}
    #print json_dumps(d)
    #print post(addr='sip:+16309792009@ims.lucentlab.com', rank=1)

