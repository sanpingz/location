#!/usr/bin/env python
# -*- coding: UTF-8 -*-
__author__ = 'sanpingz'

from xml.dom.minidom import parseString
#import json

import cgi, urllib, httplib, urllib2, SocketServer
print 'Content-type: application/json'
#print 'Content-type: text/xml'
print

get_url = 'http://135.252.143.226:8080/ParlayREST/1.0/location/queries/location'
post_url = 'http://135.252.143.226:8080/ParlayREST/1.0/location/subscriptions/periodic'
post_http = ['135.252.143.226:8080', '/ParlayREST/1.0/location/subscriptions/periodic']
post_xml = \
'''<?xml version="1.0" encoding="UTF-8"?>
<tl:periodicNotificationSubscription xmlns:tl="urn:oma:xml:rest:terminallocation:1">
<clientCorrelator>%(clientCorrelator)s</clientCorrelator>
<callbackReference>
    <notifyURL>%(notifyURL)s</notifyURL>
    <callbackData>%(callbackData)s</callbackData>
</callbackReference>
<address>%(address)s</address>
<requestedAccuracy>%(requestedAccuracy)s</requestedAccuracy>
<frequency>%(frequency)s</frequency>
</tl:periodicNotificationSubscription>'''

get_params = {
    'acceptableAccuracy': 1000,
    'maximumAge': 180,
    'requestedAccuracy': 1000,
    'responseTime': 300,
    'tolerance': 'LowDelay'
}

post_params = {
    'clientCorrelator': '0001',
    #'notifyURL': 'http://135.252.143.60:8080/notifications/LocationNotification',
    'notifyURL': 'http://135.252.143.60:8989',
    'callbackData': '1234',
    'requestedAccuracy': 10,
    'frequency': 10
}

def json_dumps(d):
    res = '{'
    if d and isinstance(d,dict):
        for key, val in d.items():
            res += '"%s": %s,' % (key, val)
        res = res[:-1]+'}'
    else:
        res = {}
    return res

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
    headers = {"Content-type": "application/xml", "Accept": "application/xml"}
    data = post_xml % params
    req = urllib2.Request(url, data, headers)
    res = 201
    try:
        print urllib2.urlopen(req).read()
    except urllib2.HTTPError, e:
        res = e.code
    return json_dumps(dict(code=res))

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

if __name__ == '__main__':
    d = {'latitude': u'300.0', 'longitude': u'3000.0'}
    #print json_dumps(d)
    print post(addr='sip:+16309792001@ims.lucentlab.com')

