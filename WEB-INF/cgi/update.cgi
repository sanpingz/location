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
    info = db.get(addr)
    if info:
        print json_dumps(info)
        #del db[addr]
    else: print ''
else:
    print ''
db.close()

if __name__ == '__main__': pass

