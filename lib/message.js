(function() {
  var Message;

  module.exports = Message = (function() {
    function Message(data) {
      var buffer;
      this.isValid = false;
      this.magic = 0x4299;
      this.message = "";
      this.length = 0;
      if (typeof data === 'string') {
        this.message = data;
      } else {
        buffer = data;
      }
      if (buffer != null) {
        this.buffer = buffer;
        this.parse();
      } else {
        this.messageString(this.message);
      }
    }

    Message.prototype.parse = function() {
      var cchk, chk, str;
      if (this.buffer.length >= 7) {
        if (this.buffer.readUIntBE(0, 2) === this.magic) {
          this.length = this.buffer.readUIntBE(2, 2);
          if (this.buffer.length === this.length) {
            str = this.readString(this.buffer.slice(4));
            cchk = this.checkSum(new Buffer(str));
            chk = this.buffer.readUIntBE(this.buffer.length - 2, 2);
            if (chk === cchk) {
              this.message = str;
              return this.isValid = true;
            }
          }
        }
      }
    };

    Message.prototype.valid = function() {
      return this.isValid;
    };

    Message.prototype.getBuffer = function() {
      return this.buffer;
    };

    Message.prototype.readString = function(buffer) {
      var x;
      x = 0;
      while (buffer[x] !== 0) {
        x++;
      }
      return buffer.slice(0, x).toString('utf8');
    };

    Message.prototype.checkSum = function(buf) {
      var i, j, len, sum;
      sum = 0;
      for (j = 0, len = buf.length; j < len; j++) {
        i = buf[j];
        sum += i;
      }
      return sum % 255;
    };

    Message.prototype.getMessage = function() {
      return this.message;
    };

    Message.prototype.messageString = function(str) {
      var chk, msgBuffer;
      msgBuffer = new Buffer(str);
      this.length = msgBuffer.length + 1 + 4 + 2 + 1;
      this.buffer = new Buffer(this.length);
      this.buffer.fill(0);
      this.buffer.writeUIntBE(this.magic, 0, 2);
      this.buffer.writeUIntBE(this.length, 2, 2);
      msgBuffer.copy(this.buffer, 4);
      chk = this.checkSum(msgBuffer);
      this.isValid = true;
      return this.buffer.writeUIntBE(chk, this.buffer.length - 2, 2);
    };

    return Message;

  })();

}).call(this);
