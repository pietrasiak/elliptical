#Includes

	_ = require 'lodash'

	Choice = require './choice'
	Sequence = require './sequence'
	Repeat = require './repeat'

	Phrase = require './phrase'
	Value = require './value'
	Placeholder = require './placeholder'

#ParseTree

	class ElementFactory
		constructor: (@scope, @lacona) ->
		
Create an object from a JSON representation.
If it is just a string, it is interpreted as a literal with just a display property

		create: (object) ->
			if _.isString(object)
				trueObject =
					type: 'literal'
					display: object
			else if _.isArray(object)
				trueObject =
					type: 'sequence'
					children: object
			else
				trueObject = object

			switch trueObject.type
				when 'value'
					element = new Value(trueObject, @scope)
				when 'choice'
					element = new Choice(trueObject, @)
				when 'sequence'
					element = new Sequence(trueObject, @)
				when 'repeat'
					element = new Repeat(trueObject, @)
				when 'queue'
					element = new Queue(trueObject, @)
				else
					element = new Placeholder(trueObject, @scope, @lacona._phraseAccessor)

			return element

	module.exports = ElementFactory