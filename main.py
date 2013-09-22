#!/usr/bin/env python
#
# Copyright 2013 Nick Freear.
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2
import sys, os
PROJECT_DIR = os.path.dirname(__file__)
sys.path.append(PROJECT_DIR + '/lib')

import validator, accessifyquery
import json, re, time, datetime


def test_jsonp_callback(callback):
    result = None
    if callback and not re.match('^[\$a-zA-Z_][\w\._]+$', callback):
        result = {
            'stat': 'fail',
            'code': 400.1,
            'message': "Error, invalid 'callback' parameter."
        }
    return result


def make_http_time_string(dt = None, minutes = 0):
    '''Input struct_time and output HTTP header-type time string'''
    if not dt:
        dt = datetime.datetime.utcnow()
    dt = dt + datetime.timedelta(minutes = minutes)
    return time.strftime('%a, %d %b %Y %H:%M:%S GMT',
            dt.timetuple())

class MainHandler(webapp2.RequestHandler):
    def get(self):
        self.redirect('http://accessify.wikia.com/wiki/Tools')


class AccessifyQueryHandler(webapp2.RequestHandler):
    def get(self):
        req = self.request
        rsp = self.response
        format  = req.get('format', default_value='json')
        callback= req.get('callback', default_value=None)
        min = req.get('min', default_value=None)
        url  = req.get('url', default_value=None)
        if not url:
            url = req.get('q', default_value=None)

        lang = req.get('lang', default_value=None)
        accept_lang = req.headers.get('Accept-Language')

        rsp.headers['Content-Type'] = 'application/json; charset=utf-8'
        rsp.headers['Access-Control-Allow-Origin'] = '*'
        rsp.headers['Cache-Control'] = 'public, max-age=300'
        rsp.headers['Expires'] = make_http_time_string(minutes = 5)
        #rsp.headers['Last-Modified'] = make_http_time_string()
        #Vary: Accept-Encoding

        result = test_jsonp_callback(callback)
        if result:
            rsp.write(json.dumps(result))
            return

        result = accessifyquery.query(url, min, lang)

        #if format == 'json':

        if callback:
            rsp.headers['Content-Type'] = 'text/javascript; charset=utf-8'
            rsp.write(''.join([ callback, '(', json.dumps(result), ');' ]))
        else:
            rsp.write(json.dumps(result))


class ValidateHandler(webapp2.RequestHandler):
    def get(self):
        req = self.request
        rsp = self.response

        format  = req.get('format', default_value='html') #Or 'json'
        callback= req.get('callback', default_value=None)
        schema_url = req.get('schema_url', default_value=None)
        url  = req.get('url', default_value=None)
        yaml = req.get('yaml', default_value=None) # POST or GET?
        result = None

        if format == 'json':
            if not url and not yaml:
                result = {
                    "stat": "fail",
                    "code": 400,
                    "message": "Error, expecting either 'url' or 'yaml' parameter."
                }
            else:
                result = validator.validate(url, yaml, schema_url)

            rsp.headers["Content-Type"] = 'application/json; charset=utf-8'
            rsp.write(json.dumps(result))

        else:
            rsp.write('Validate!')
            rsp.write(format)


app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/query', AccessifyQueryHandler), # Deprecated
    ('/fix', AccessifyQueryHandler),
    ('/validate', ValidateHandler)
], debug=True)
