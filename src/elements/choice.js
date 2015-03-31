/** @jsx createElement */
import _ from 'lodash'
import {createElement, Phrase} from 'lacona-phrase'
import {reconcile} from '../reconcile'
import parse from '../parse'

export default class Choice extends Phrase {
  *_handleParse(input, options) {
    let successes = 0
    let scoredOutputs = []
    this.childPhrases = reconcile({descriptor: this.props.children, phrase: this.childPhrases, options})

    for (let [childDescription, childPhrase] of _.zip(this.props.children, this.childPhrases)) {
      let success = false

      for (let output of parse({phrase: childPhrase, input, options})) {
        if (this.props.ordered) {
          const obj = {output, childDescription}
          const index = _.sortedIndex(scoredOutputs, obj, obj => obj.output.score)
          scoredOutputs.splice(index, 0, obj)
        } else {
          if (this.props.limit || this.props.value) {
            output = _.assign({}, output, {
              callbacks: output.callbacks.concat(() => success = true),
              result: this.props.value || output.result
            })
          }
          yield output
        }
      }

      if (success) successes++
      if (this.props.limit && this.props.limit <= successes) break
    }

    if (this.props.ordered) {
      const childSet = new Set()

      for (let {output, childDescription} of scoredOutputs) {
        let success = false

        if (this.props.limit || this.props.value) {
          output = _.assign({}, output, {
            callbacks: output.callbacks.concat(() => success = true),
            result: this.props.value || output.result
          })
        }
        yield output

        if (success) childSet.add(childDescription)
        if (this.props.limit && this.props.limit <= childSet.size) break
      }
    }
  }
}
