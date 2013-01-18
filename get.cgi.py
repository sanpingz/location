#!/usr/bin/env python
# -*- coding: UTF-8 -*-
__author__ = 'sanpingz'

import cgi, urllib
#print 'Content-type: application/json'
print 'Content-type: text/xml'
print

form = cgi.FieldStorage()
url = form['rest'].value+'?'
param = {}
for key in form.keys():
    if key != 'rest':
        '%s=%s' % (key, form[key].value)

xml = urllib.urlopen(url)

print xml

if __name__ == '__main__':
    url = 'http://135.252.143.226:8080/ParlayREST/1.0/location/queries/location?address=sip%3A%2B16309792001%40ims.lucentlab.com&tolerance=LowDelay&requestedAccuracy=1000&acceptableAccuracy=1000&maximumAge=180&responseTime=300'
    xml = urllib.urlopen(url)
    print xml
