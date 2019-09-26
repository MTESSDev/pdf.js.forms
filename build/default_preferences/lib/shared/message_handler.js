"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageHandler = MessageHandler;

var _util = require("./util");

const StreamKind = {
  UNKNOWN: 0,
  CANCEL: 1,
  CANCEL_COMPLETE: 2,
  CLOSE: 3,
  ENQUEUE: 4,
  ERROR: 5,
  PULL: 6,
  PULL_COMPLETE: 7,
  START_COMPLETE: 8
};

function wrapReason(reason) {
  if (typeof reason !== 'object') {
    return reason;
  }

  switch (reason.name) {
    case 'AbortException':
      return new _util.AbortException(reason.message);

    case 'MissingPDFException':
      return new _util.MissingPDFException(reason.message);

    case 'UnexpectedResponseException':
      return new _util.UnexpectedResponseException(reason.message, reason.status);

    case 'UnknownErrorException':
      return new _util.UnknownErrorException(reason.message, reason.details);

    default:
      return new _util.UnknownErrorException(reason.message, reason.toString());
  }
}

function MessageHandler(sourceName, targetName, comObj) {
  this.sourceName = sourceName;
  this.targetName = targetName;
  this.comObj = comObj;
  this.callbackId = 1;
  this.streamId = 1;
  this.postMessageTransfers = true;
  this.streamSinks = Object.create(null);
  this.streamControllers = Object.create(null);
  let callbacksCapabilities = this.callbacksCapabilities = Object.create(null);
  let ah = this.actionHandler = Object.create(null);

  this._onComObjOnMessage = event => {
    let data = event.data;

    if (data.targetName !== this.sourceName) {
      return;
    }

    if (data.stream) {
      this._processStreamMessage(data);
    } else if (data.isReply) {
      let callbackId = data.callbackId;

      if (data.callbackId in callbacksCapabilities) {
        let callback = callbacksCapabilities[callbackId];
        delete callbacksCapabilities[callbackId];

        if ('reason' in data) {
          callback.reject(wrapReason(data.reason));
        } else {
          callback.resolve(data.data);
        }
      } else {
        throw new Error(`Cannot resolve callback ${callbackId}`);
      }
    } else if (data.action in ah) {
      let action = ah[data.action];

      if (data.callbackId) {
        let sourceName = this.sourceName;
        let targetName = data.sourceName;
        new Promise(function (resolve) {
          resolve(action(data.data));
        }).then(function (result) {
          comObj.postMessage({
            sourceName,
            targetName,
            isReply: true,
            callbackId: data.callbackId,
            data: result
          });
        }, function (reason) {
          comObj.postMessage({
            sourceName,
            targetName,
            isReply: true,
            callbackId: data.callbackId,
            reason: wrapReason(reason)
          });
        });
      } else if (data.streamId) {
        this._createStreamSink(data);
      } else {
        action(data.data);
      }
    } else {
      throw new Error(`Unknown action from worker: ${data.action}`);
    }
  };

  comObj.addEventListener('message', this._onComObjOnMessage);
}

MessageHandler.prototype = {
  on(actionName, handler) {
    var ah = this.actionHandler;

    if (ah[actionName]) {
      throw new Error(`There is already an actionName called "${actionName}"`);
    }

    ah[actionName] = handler;
  },

  send(actionName, data, transfers) {
    this.postMessage({
      sourceName: this.sourceName,
      targetName: this.targetName,
      action: actionName,
      data
    }, transfers);
  },

  sendWithPromise(actionName, data, transfers) {
    var callbackId = this.callbackId++;
    var capability = (0, _util.createPromiseCapability)();
    this.callbacksCapabilities[callbackId] = capability;

    try {
      this.postMessage({
        sourceName: this.sourceName,
        targetName: this.targetName,
        action: actionName,
        callbackId,
        data
      }, transfers);
    } catch (ex) {
      capability.reject(ex);
    }

    return capability.promise;
  },

  sendWithStream(actionName, data, queueingStrategy, transfers) {
    let streamId = this.streamId++;
    let sourceName = this.sourceName;
    let targetName = this.targetName;
    const comObj = this.comObj;
    return new _util.ReadableStream({
      start: controller => {
        let startCapability = (0, _util.createPromiseCapability)();
        this.streamControllers[streamId] = {
          controller,
          startCall: startCapability,
          pullCall: null,
          cancelCall: null,
          isClosed: false
        };
        this.postMessage({
          sourceName,
          targetName,
          action: actionName,
          streamId,
          data,
          desiredSize: controller.desiredSize
        }, transfers);
        return startCapability.promise;
      },
      pull: controller => {
        let pullCapability = (0, _util.createPromiseCapability)();
        this.streamControllers[streamId].pullCall = pullCapability;
        comObj.postMessage({
          sourceName,
          targetName,
          stream: StreamKind.PULL,
          streamId,
          desiredSize: controller.desiredSize
        });
        return pullCapability.promise;
      },
      cancel: reason => {
        (0, _util.assert)(reason instanceof Error, 'cancel must have a valid reason');
        let cancelCapability = (0, _util.createPromiseCapability)();
        this.streamControllers[streamId].cancelCall = cancelCapability;
        this.streamControllers[streamId].isClosed = true;
        comObj.postMessage({
          sourceName,
          targetName,
          stream: StreamKind.CANCEL,
          streamId,
          reason: wrapReason(reason)
        });
        return cancelCapability.promise;
      }
    }, queueingStrategy);
  },

  _createStreamSink(data) {
    let self = this;
    let action = this.actionHandler[data.action];
    let streamId = data.streamId;
    let desiredSize = data.desiredSize;
    let sourceName = this.sourceName;
    let targetName = data.sourceName;
    let capability = (0, _util.createPromiseCapability)();
    const comObj = this.comObj;
    let streamSink = {
      enqueue(chunk, size = 1, transfers) {
        if (this.isCancelled) {
          return;
        }

        let lastDesiredSize = this.desiredSize;
        this.desiredSize -= size;

        if (lastDesiredSize > 0 && this.desiredSize <= 0) {
          this.sinkCapability = (0, _util.createPromiseCapability)();
          this.ready = this.sinkCapability.promise;
        }

        self.postMessage({
          sourceName,
          targetName,
          stream: StreamKind.ENQUEUE,
          streamId,
          chunk
        }, transfers);
      },

      close() {
        if (this.isCancelled) {
          return;
        }

        this.isCancelled = true;
        comObj.postMessage({
          sourceName,
          targetName,
          stream: StreamKind.CLOSE,
          streamId
        });
        delete self.streamSinks[streamId];
      },

      error(reason) {
        (0, _util.assert)(reason instanceof Error, 'error must have a valid reason');

        if (this.isCancelled) {
          return;
        }

        this.isCancelled = true;
        comObj.postMessage({
          sourceName,
          targetName,
          stream: StreamKind.ERROR,
          streamId,
          reason: wrapReason(reason)
        });
      },

      sinkCapability: capability,
      onPull: null,
      onCancel: null,
      isCancelled: false,
      desiredSize,
      ready: null
    };
    streamSink.sinkCapability.resolve();
    streamSink.ready = streamSink.sinkCapability.promise;
    this.streamSinks[streamId] = streamSink;
    new Promise(function (resolve) {
      resolve(action(data.data, streamSink));
    }).then(function () {
      comObj.postMessage({
        sourceName,
        targetName,
        stream: StreamKind.START_COMPLETE,
        streamId,
        success: true
      });
    }, function (reason) {
      comObj.postMessage({
        sourceName,
        targetName,
        stream: StreamKind.START_COMPLETE,
        streamId,
        reason: wrapReason(reason)
      });
    });
  },

  _processStreamMessage(data) {
    let sourceName = this.sourceName;
    let targetName = data.sourceName;
    const streamId = data.streamId;
    const comObj = this.comObj;

    let deleteStreamController = () => {
      Promise.all([this.streamControllers[streamId].startCall, this.streamControllers[streamId].pullCall, this.streamControllers[streamId].cancelCall].map(function (capability) {
        return capability && capability.promise.catch(function () {});
      })).then(() => {
        delete this.streamControllers[streamId];
      });
    };

    switch (data.stream) {
      case StreamKind.START_COMPLETE:
        if (data.success) {
          this.streamControllers[streamId].startCall.resolve();
        } else {
          this.streamControllers[streamId].startCall.reject(wrapReason(data.reason));
        }

        break;

      case StreamKind.PULL_COMPLETE:
        if (data.success) {
          this.streamControllers[streamId].pullCall.resolve();
        } else {
          this.streamControllers[streamId].pullCall.reject(wrapReason(data.reason));
        }

        break;

      case StreamKind.PULL:
        if (!this.streamSinks[streamId]) {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.PULL_COMPLETE,
            streamId,
            success: true
          });
          break;
        }

        if (this.streamSinks[streamId].desiredSize <= 0 && data.desiredSize > 0) {
          this.streamSinks[streamId].sinkCapability.resolve();
        }

        this.streamSinks[streamId].desiredSize = data.desiredSize;
        const {
          onPull
        } = this.streamSinks[data.streamId];
        new Promise(function (resolve) {
          resolve(onPull && onPull());
        }).then(function () {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.PULL_COMPLETE,
            streamId,
            success: true
          });
        }, function (reason) {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.PULL_COMPLETE,
            streamId,
            reason: wrapReason(reason)
          });
        });
        break;

      case StreamKind.ENQUEUE:
        (0, _util.assert)(this.streamControllers[streamId], 'enqueue should have stream controller');

        if (this.streamControllers[streamId].isClosed) {
          break;
        }

        this.streamControllers[streamId].controller.enqueue(data.chunk);
        break;

      case StreamKind.CLOSE:
        (0, _util.assert)(this.streamControllers[streamId], 'close should have stream controller');

        if (this.streamControllers[streamId].isClosed) {
          break;
        }

        this.streamControllers[streamId].isClosed = true;
        this.streamControllers[streamId].controller.close();
        deleteStreamController();
        break;

      case StreamKind.ERROR:
        (0, _util.assert)(this.streamControllers[streamId], 'error should have stream controller');
        this.streamControllers[streamId].controller.error(wrapReason(data.reason));
        deleteStreamController();
        break;

      case StreamKind.CANCEL_COMPLETE:
        if (data.success) {
          this.streamControllers[streamId].cancelCall.resolve();
        } else {
          this.streamControllers[streamId].cancelCall.reject(wrapReason(data.reason));
        }

        deleteStreamController();
        break;

      case StreamKind.CANCEL:
        if (!this.streamSinks[streamId]) {
          break;
        }

        const {
          onCancel
        } = this.streamSinks[data.streamId];
        new Promise(function (resolve) {
          resolve(onCancel && onCancel(wrapReason(data.reason)));
        }).then(function () {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.CANCEL_COMPLETE,
            streamId,
            success: true
          });
        }, function (reason) {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.CANCEL_COMPLETE,
            streamId,
            reason: wrapReason(reason)
          });
        });
        this.streamSinks[streamId].sinkCapability.reject(wrapReason(data.reason));
        this.streamSinks[streamId].isCancelled = true;
        delete this.streamSinks[streamId];
        break;

      default:
        throw new Error('Unexpected stream case');
    }
  },

  postMessage(message, transfers) {
    if (transfers && this.postMessageTransfers) {
      this.comObj.postMessage(message, transfers);
    } else {
      this.comObj.postMessage(message);
    }
  },

  destroy() {
    this.comObj.removeEventListener('message', this._onComObjOnMessage);
  }

};