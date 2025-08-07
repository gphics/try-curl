class RequestParser {
  constructor(command) {
    this.command = command;
    this.commandArr = command.split("|");
    this.err = null;
    this.data = {};
    // validating the delimiter
    if (!command.includes("|") || this.commandArr.length < 2) {
      this.err = command.length
        ? "Use '|' as the delimeter"
        : "command must be provided";
    }
  }
  /**
   * This method runs the methods that parse the request
   * @returns {data, err}
   */
  process() {
    if (this.err) {
      return { err: this.err, data: null };
    }
    this.getHttp(this.commandArr[0]);
    this.getUrl(this.commandArr[1]);
    this.commandArr.slice(2).forEach((elem, index) => {
      if (elem) {
        const isQuery = this.validatePart("QUERY", elem);
        const isHeaders = this.validatePart("HEADERS", elem);
        const isBody = this.validatePart("BODY", elem);
        if (isQuery) {
          this.getQuery(elem);
        } else if (isHeaders) {
          this.getHeaders(elem);
        } else if (isBody) {
          this.getBody(elem);
        } else {
          this.err = "Keyword not valid";
        }
      }
    });
    return { data: this.data, err: this.err };
   
  }

  validatePart(str, body) {
    return body.includes(str);
  }
  getHttp(param) {
    const value = param.trim();
    const allowedMethod = ["POST", "GET"];
    const httpString = value.slice(0, 4);
    const correctHttpString = "HTTP";
    if (httpString === correctHttpString) {
      const method = value.slice(4).trim();
      if (allowedMethod.includes(method)) {
        this.data.HTTP = method;
      } else {
        this.err = `${method} not allowed`;
        return;
      }
    } else if (httpString === correctHttpString.toLowerCase()) {
      this.err = "http string must be in uppercase";
    } else {
      this.err = "HTTP keyword must be provided";
    }
  }
  getUrl(param) {
    const value = param.trim();
    const URLKeyword = value.slice(0, 3);
    const correctUrlKeyword = "URL";
    if (URLKeyword === correctUrlKeyword) {
      const url = value.slice(3).trim();
      this.data.URL = url;
    } else if (URLKeyword.toLowerCase() === correctUrlKeyword) {
      this.err = "url keyword must be in uppercase";
    } else {
      this.err = "URL keyword must be provided";
    }
  }
  getHeaders(param) {
    const value = param.trim();
    const headersKeyword = value.slice(0, 8);
    const correctHeadersKeyword = "HEADERS";
    if (headersKeyword === correctHeadersKeyword) {
      const strValue = value.slice(8).trim();
      //   coverting to json
      try {
        const jsonValue = JSON.parse(strValue);
        this.data.HEADERS = jsonValue;
      } catch (error) {
        this.err = "Headers value must be a valid json";
      }
    } else if (correctHeadersKeyword.toLowerCase() === headersKeyword) {
      this.err = "headers keyword must be in uppercase";
    } else {
      this.err = "'HEADERS' keyword must be provided";
    }
  }
  getQuery(param) {
    const value = param.trim();
    const queryKeyword = value.slice(0, 5);

    const correctQueryKeyword = "QUERY";
    if (queryKeyword === correctQueryKeyword) {
      const strValue = value.slice(5).trim();
      //   coverting to json
      try {
        const jsonValue = JSON.parse(strValue);
        this.data.QUERY = jsonValue;
      } catch (error) {
        this.err = "Query value must be a valid json";
      }
    } else if (correctQueryKeyword.toLowerCase() === queryKeyword) {
      this.err = "Query keyword must be in uppercase";
    } else {
      this.err = "'QUERY' keyword must be provided";
    }
  }
  getBody(param) {
    const value = param.trim();
    const bodyKeyword = value.slice(0, 4);
    const correctBodysKeyword = "BODY";
    if (bodyKeyword === correctBodysKeyword) {
      const strValue = value.slice(4).trim();
      //   coverting to json
      try {
        const jsonValue = JSON.parse(strValue);
        this.data.BODY = jsonValue;
      } catch (error) {
        this.err = "Body value must be a valid json";
      }
    } else if (correctBodysKeyword.toLowerCase() === bodyKeyword) {
      this.err = "Body keyword must be in uppercase";
    } else {
      this.err = "'BODY' keyword must be provided";
    }
  }
}

module.exports = RequestParser;
