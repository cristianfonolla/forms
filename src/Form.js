import Errors from './Errors'

import axios from 'axios'

export default class Form {
    /**
     * Constructor.
     *
     * @param fields
     */
    constructor (fields) {
        this.clearOnSubmit = false

        this.originalFields = fields

        this.errors = new Errors()

        this.resetStatus()

        for (let field in fields) {
            this[field] = fields[field]
        }
    }

    /**
     * Retrieve the field form.
     *
     * @param field
     * @returns {*}
     */
    get (field) {
        if (this.has(field)) {
            return this[field]
        }
    }

    /**
     * Set the field value.
     *
     * @param field
     * @param value
     */
    set (field, value) {
        if (this.has(field)) {
            this[field] = value
        }
    }

    /**
     * Check if a field exists on form
     *
     * @param field
     * @returns {boolean}
     */
    has (field) {
        return this.hasOwnProperty(field)
    }

    /**
     * Reset form.
     *
     */
    reset () {
        this.fields = {}

        for (let field in this.originalFields) {
            this[field] = ''
        }

        this.errors.clear()
    }

    /**
     * Activates form clearing/reset after submit.
     *
     */
    clearOnSubmit () {
        this.clearOnSubmit = true
    }

    /**
     * Reset status.
     *
     */
    resetStatus () {
        this.errors.forget()
        this.submitting = false
        this.submitted = false
        this.succeeded = false
    }

    /**
     * Get form data.
     *
     * @returns {{}}
     */
    data () {
        let data = {}

        for (let field in this.originalFields) {
            data[field] = this[field]
        }

        return data
    }

    /**
     * Start processing the form.
     *
     */
    startProcessing () {
        this.errors.forget()
        this.submitting = true
        this.succeeded = false
    };

    /**
     * Finish processing the form.
     *
     */
    finishProcessing () {
        this.submitting = false
        this.submitted = false
        this.succeeded = true
    }

    /**
     * Finish processing the form on errors.
     */
    finishProcessingOnErrors () {
        this.submitting = false
        this.submitted = false
        this.succeeded = false
    }

    /**
     * Send a POST request to the given URL.
     *
     * @param url
     * @returns {*}
     */
    post (url) {
        return this.submit('post', url)
    }

    /**
     * Send a PUT request to the given URL.
     *
     * @param url
     * @returns {*}
     */
    put (url) {
        return this.submit('put', url)
    }

    /**
     * Send a PATCH request to the given URL.
     *
     * @param url
     * @returns {*}
     */
    patch (url) {
        return this.submit('patch', url)
    }

    /**
     * Send a DELETE request to the given URL.
     *
     * @param url
     * @returns {*}
     */
    delete (url) {
        return this.submit('delete', url)
    }

    /**
     * Submit the form to the back-end api/server.
     *
     * @param requesType
     * @param url
     * @returns {Promise}
     */
    submit (requesType, url) {
        this.startProcessing()
        return new Promise((resolve, reject) => {
                axios[requesType](url, this.data())
                    .then(response => {
                    this.onSuccess()
                resolve(response)
            })
    .catch(error => {
            this.onFail(error.response.data)
        reject(error)
    })
    })
    }

    /**
     * Process on success.
     */
    onSuccess () {
        this.finishProcessing()
        if (this.clearOnSubmit) this.reset()
    }

    /**
     * Process on fail.
     *
     * @param errors
     */
    onFail (errors) {
        this.errors.record(errors)
        this.finishProcessingOnErrors()
    }

    /**
     * Set the errors on the form.
     *
     * @param errors
     */
    setErrors (errors) {
        this.submitting = false
        this.errors.set(errors)
    };
}