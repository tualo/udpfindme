module.exports =
class Message
  constructor: (data) ->
    @isValid = false
    @magic = 0x4299
    @message = ""
    @length = 0
    if typeof data=='string'
      @message = data
    else
      buffer = data

    if buffer?
      @buffer = buffer
      @parse()
    else
      @messageString @message

  parse: () ->
    if @buffer.length >= 7
      if @buffer.readUIntBE(0, 2)==@magic
        @length = @buffer.readUIntBE(2, 2)
        if @buffer.length == @length
          str = @readString @buffer.slice(4)
          cchk = @checkSum(new Buffer(str))
          chk = @buffer.readUIntBE @buffer.length - 2, 2
          if chk == cchk
            @message = str
            @isValid = true

  valid: () ->
    @isValid

  getBuffer: () ->
    @buffer

  readString: (buffer) ->
    x = 0
    while buffer[x] != 0
      x++
    buffer.slice(0,x).toString 'utf8'

  checkSum: (buf) ->
    sum = 0
    (sum+=i for i in buf)
    sum % 255
  getMessage: () ->
    @message

  messageString: (str) ->
    msgBuffer = new Buffer str
    @length = msgBuffer.length + 1 + 4 + 2 + 1
    @buffer = new Buffer @length
    @buffer.fill 0
    @buffer.writeUIntBE @magic, 0, 2
    @buffer.writeUIntBE @length, 2, 2
    msgBuffer.copy @buffer , 4
    chk = @checkSum msgBuffer
    @isValid = true
    @buffer.writeUIntBE chk, @buffer.length - 2, 2
