#!/usr/bin/env python
'''
  Validate a fixes-JSON/ YAML file against a JSON Schema.

  Nick Freear, 19 April 2013.

  yaml?
'''
import urllib2, json
from jsonschema import validate, ValidationError, SchemaError

schema_file = 'accessify-base-json-schema.json'
data_file = 'data.json'


# A sample schema, like what we'd get from json.load()
schema_ex = {
    "type" : "object",
    "properties" : {
        "price" : {"type" : "number"},
        "name" : {"type" : "string"},
    },
}

# If no exception is raised by validate(), the instance is valid.
validate({"name" : "Eggs", "price" : 34.99}, schema_ex)

#validate(
#    {"name" : "Eggs", "price" : "Invalid"}, schema_ex
#)                                   # doctest: +IGNORE_EXCEPTION_DETAIL


with open(schema_file, 'r') as fs:
    json_schema = fs.read()

with open(data_file, 'r') as fd:
    json_data = fd.read()

try:
    schema = json.loads(json_schema)
except ValueError as er:
    print "Error, JSON value in schema ::", er
    exit(-3)

try:
    data = json.loads(json_data)
except ValueError as er:
    print "Error, JSON value in data ::", er
    exit(-3)

try:
    validate(data, schema)
except DeprecationWarning as w:
    print "Woops, deprecation."
except SchemaError as es:
    print "Error, schema ::", es
    exit(-1)
except ValidationError as ev:
    print "Error, validation ::", ev
    exit(-2)

print "OK, validates", data_file, schema_file
