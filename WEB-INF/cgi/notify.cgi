#!/usr/bin/env python
# -*- coding: UTF-8 -*-
__author__ = 'sanpingz'

import sys
from xml.dom.minidom import parseString
import shelve
from common import *

def value(xml):
    dom = xml and parseString(xml)
    node = dom and dom.getElementsByTagName('currentLocation')[0].childNodes
    addr = dom and dom.getElementsByTagName('address')[0].firstChild
    if node and addr:
        latitude = node[1].firstChild.data
        longitude = node[3].firstChild.data
        address = addr.data
        return dict(latitude=latitude, longitude=longitude, address=address)
    else: return {}

xml = sys.stdin.read().strip()
info = value(xml)
if xml and info:
    db = shelve.open(DB_NAME)
    addr = str(info['address'])
    del info['address']
    db[addr] = info
    db.close()

def test():
    xml = xml_info
    data = value(xml)
    db = shelve.open(DB_NAME)
    addr = str(data['address'])
    del data['address']
    db[addr] = data
    print db[addr]
    db.close()

if __name__ == '__main__':
    #test()
    pass


