#!/usr/bin/env python
# -*- coding: UTF-8 -*-
__author__ = 'sanpingz'

from xml.dom.minidom import parseString
#import json
import cgi, urllib, httplib, urllib2, shelve, time
from common import *

print 'Content-type: application/json'
#print 'Content-type: text/xml'
print

def value(xml):
    dom = parseString(xml)
    node = dom and dom.getElementsByTagName('currentLocation')[0].childNodes
    latitude = node[1].firstChild.data
    longitude = node[3].firstChild.data
    d = dict(latitude=latitude, longitude=longitude)
    return json_dumps(d)
def get(addr, url = get_url, params = get_params):
    params['address']=addr
    params = urllib.urlencode(params)
    url = '%s?%s' % (url,params)
    xml = urllib.urlopen(url)
    try:
        dom = xml.read()
    finally:
        xml.close()
    return dom and value(dom)

def post(addr, url = post_url, params = post_params):
    params['address']=addr
    db = shelve.open(DB_NAME)
    try:
        if db.has_key(addr) and (time.time()-db[addr]['time'])>7200:
            del db[addr]
    finally: db.close()
    headers = {"Content-type": "application/xml", "Accept": "application/xml"}
    data = post_xml % params
    req = urllib2.Request(url, data, headers)
    #code = 500
    try:
        cb = urllib2.urlopen(req)
        code = cb.code
        #msg = cb.msg
    except urllib2.HTTPError, e:
        code = e.code
        #msg = e.msg
    res = dict(code=code)
    if code!=201:
        if str(code) in http_code.keys():
            res['msg'] = http_code[str(code)]
        else:
            res['msg'] = 'Unexpected error'
    return json_dumps(res)

def http_post(addr, url = post_http, params = post_params):
    params['address']=addr
    conn = httplib.HTTPConnection(url[0])
    headers = {"Content-type": "application/xml", "Accept": "application/xml"}
    conn.request('POST', url[1], headers=headers)
    conn.send(post_xml % params)
    res = conn.getresponse()
    print res.reason
    print res.msg
    conn.close()
    return res.read()

form = cgi.FieldStorage()
addr = form.getvalue('address')
method = form.getvalue('method')
if addr:
    if method == 'GET':
        print get(addr)
    elif method == 'POST':
        print post(addr)
else:
    print ''

if __name__ == '__main__': pass
    #d = {'latitude': u'300.0', 'longitude': u'3000.0'}
    #print json_dumps(d)
    #print post(addr='sip:+16309792001@ims.lucentlab.com')

