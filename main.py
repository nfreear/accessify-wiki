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
import json


class MainHandler(webapp2.RequestHandler):
    def get(self):
        self.response.write('Hello world!')


class AccessifyQueryHandler(webapp2.RequestHandler):
    def get(self):
        req = self.request
        rsp = self.response

        format  = req.get('format', default_value='json')
        callback= req.get('callback', default_value=None)
        url  = req.get('url', default_value=None)
        result = None

        result = accessifyquery.query(url)

        #if format == 'json':

        rsp.headers.add('Content-Type', 'application/json; charset=UTF-8')
        rsp.write(json.dumps(result))


class ValidateHandler(webapp2.RequestHandler):
    def get(self):
        #result = {}
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

            rsp.headers.add('Content-Type', 'application/json; charset=UTF-8')
            rsp.write(json.dumps(result))

        else:
            rsp.write('Validate!')
            rsp.write(format)


app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/query', AccessifyQueryHandler),
    ('/validate', ValidateHandler)
], debug=True)
