#!/usr/bin/env python
# -*- coding: UTF-8 -*-
__author__ = 'sanpingz'

from common import *

import cgi, shelve
print 'Content-type: application/json'
print

form = cgi.FieldStorage()
addr = form.getvalue('address')
if addr:
    db = shelve.open(DB_NAME)
    info = db[addr]
    print json_dumps(info)
else:
    print ''
db.close()

if __name__ == '__main__': pass
    #d = {'latitude': u'300.0', 'longitude': u'3000.0'}
    #print json_dumps(d)
    #print post(addr='sip:+16309792001@ims.lucentlab.com')

