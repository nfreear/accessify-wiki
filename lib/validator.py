#!/usr/bin/env python
#
# Copyright 2013 Nick Freear.
#
#http://localhost:8080/validate?format=json&callback=FN&yaml={}&url=http://dl.dropbox.com/u/3203144/wai-aria/fix/scraperwiki-wai-aria.yaml
#
import jsonschema as jss
#import requests, httplib2, markdown
import urllib2
import yaml, json, os

PROJECT_DIR = os.path.dirname(__file__)

# The static file.
schema_path = '/schema/accessify-base-json-schema.json'
# Local copy to be read.
schema_file = PROJECT_DIR + '/accessify-fixes-json-schema.json'


schema_2 = {
    "type" : "object",
    "properties" : {
        "price" : {"type" : "number"},
        "name" : {"type" : "string"}
    }
}

result = {
    #"stat": "fail",
    #"code": 500,
    #"message": "Error, unknown error"
    "stat": "ok",
    "code": 200,
    "message": "Success?",
    #"schema": {},
    #"data": {},
}


def validate(url, yaml_data, schema_url):
    if url:
        req = urllib2.Request(url)
        req.add_header('Referer', 'http://accessifywiki.org/')
        fd = urllib2.urlopen(req)
        yaml_data = fd.read()
        #rd = requests.get(url)
        #if rd.status_code == requests.codes.ok:
        #    yaml_data = rd.text
        #else:
        #    print "Error, url"

    try:
        yaml_data = yaml.safe_load(yaml_data)
    except Exception, ex:
        result['message'] = "Error, YAML is not well-formed"
        result['detail'] = "ERROR:\n\n" + str(ex)
        result['stat'] = "fail"
        result['code'] = 400.1

    if result['stat'] == 'fail':
        return result

    if schema_url:
        rs = requests.get(schema_url)
        if rs.status_code == requests.codes.ok:
            schema = rs.text
        else:
            print "Error, schema_url"
    else:
        #IOError: [Errno 13] file not accessible: '../lib/accessify-fixes-json-schema-x.json'
        with open(schema_file, 'r') as fs:
            schema = fs.read()
        #schema = "{}" # Read from file.

    schema = json.loads(schema)

    try:
        #jss.validate({"name" : "Eggs", "price" : 34.99}, schema)
        jss.validate(yaml_data, schema)
    except jss.ValidationError, ex:
        result['detail'] = str(ex)[0:130]
        #result['ex'] = str(ex)
        result['message'] = "Error, YAML data validation."
        result['stat'] = "fail"
        result['code'] = 400.2
    except jss.SchemaError:
        result['message'] = "Error, JSON Schema validation."
        result['stat'] = "fail"

    #result['schema'] = schema
    result['url'] = url
    result['schema_url'] = schema_path
    result['data'] = yaml_data

    if result['stat'] == 'ok':
        result['message'] = "OK, the YAML validates against the schema."

    return result
