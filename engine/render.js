let gl, texLocation;

export function init(canvas) {
  gl = canvas.getContext('webgl2');

  const program = createProgram(glsl['shader-vertex'], glsl['shader-fragment']);
  gl.useProgram(program);

  texLocation = gl.getUniformLocation(program, "u_image");
  resize(canvas);

  function createShader(source, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  }

  function createProgram(vertex, fragment) {
    var program = gl.createProgram();
    gl.attachShader(program, createShader(vertex, gl.VERTEX_SHADER));
    gl.attachShader(program, createShader(fragment, gl.FRAGMENT_SHADER));
    gl.linkProgram(program);
    
    program.createUniform = function (type, name) {
      var location = gl.getUniformLocation(program, name);
      return function (v1, v2, v3, v4) {
        gl['uniform' + type](location, v1, v2, v3, v4);
      }
    };
    
    return program;
  }
}

export function resize(canvas) {
  gl.viewport(0, 0, canvas.width, canvas.height);
}

export function render(canvas) {
  uploadImage(canvas);

  gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);
}

function uploadImage(image) {
  // Create a texture.
  var texture = gl.createTexture();
 
  // make unit 0 the active texture unit
  // (i.e, the unit all other texture commands will affect.)
  gl.activeTexture(gl.TEXTURE0 + 0);
 
  // Bind texture to 'texture unit '0' 2D bind point
  gl.bindTexture(gl.TEXTURE_2D, texture);
 
  // Set the parameters so we don't need mips and so we're not filtering
  // and we don't repeat
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
 
  // Upload the image into the texture.
  var mipLevel = 0;               // the largest mip
  var internalFormat = gl.RGBA;   // format we want in the texture
  var srcFormat = gl.RGBA;        // format of data we are supplying
  var srcType = gl.UNSIGNED_BYTE  // type of data we are supplying
  gl.texImage2D(gl.TEXTURE_2D,
                mipLevel,
                internalFormat,
                srcFormat,
                srcType,
                image);

  gl.uniform1i(texLocation, 0);
}

const glsl = {
  'shader-fragment': `#version 300 es
precision highp float;

uniform sampler2D u_image;
in vec2 texCoord;

out vec4 fragmentColor;

void main(void) {
  vec2 coord = vec2(texCoord.x, 1.0 - texCoord.y);
  fragmentColor = texture(u_image, coord);
}
  `,
  'shader-vertex': `#version 300 es

precision highp float;

out vec2 texCoord;

void main(void) {
    float x = float((gl_VertexID & 1) << 2);
    float y = float((gl_VertexID & 2) << 1);
    texCoord.x = x * 0.5;
    texCoord.y = y * 0.5;
    gl_Position = vec4(x - 1.0, y - 1.0, 0, 1);
}
  `,
};

