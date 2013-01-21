#!/usr/bin/env python
# -*- coding: UTF-8 -*-
__author__ = 'sanpingz'

from xml.dom.minidom import parse, parseString
import xml.dom.minidom
import json

import cgi, urllib
print 'Content-type: application/json'
#print 'Content-type: text/xml'
print

url = 'http://135.252.143.226:8080/ParlayREST/1.0/location/queries/location'
params = {
    'acceptableAccuracy': 1000,
    'maximumAge': 180,
    'requestedAccuracy': 1000,
    'responseTime': 300,
    'tolerance': 'LowDelay'
}

def value(xml):
    dom = parseString(xml)
    node = dom and dom.getElementsByTagName('currentLocation')[0].childNodes
    latitude = node[1].firstChild.data
    longitude = node[3].firstChild.data
    d = dict(latitude=latitude, longitude=longitude)
    return json.dumps(d)
def get(addr, url = url, params = params):
    params['address']=addr
    params = urllib.urlencode(params)
    url = '%s?%s' % (url,params)
    xml = urllib.urlopen(url)
    dom = xml.read()
    xml.close()
    print dom and value(dom)

def post(addr, url = url, params = params):
    params['address']=addr
    params = urllib.urlencode(params)
    xml = urllib.urlopen(url, params)
    dom = xml.read()
    xml.close()
    print dom and value(dom)

form = cgi.FieldStorage()
addr = form.getvalue('address')
if addr:
    print get(addr)
else:
    print ''

if __name__ == '__main__':
    get(addr='sip:+16309792001@ims.lucentlab.com')