function multiplyMatrices(matrixA, matrixB) {
    var result = [];

    for (var i = 0; i < 4; i++) {
        result[i] = [];
        for (var j = 0; j < 4; j++) {
            var sum = 0;
            for (var k = 0; k < 4; k++) {
                sum += matrixA[i * 4 + k] * matrixB[k * 4 + j];
            }
            result[i][j] = sum;
        }
    }

    // Flatten the result array
    return result.reduce((a, b) => a.concat(b), []);
}
function createIdentityMatrix() {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}
function createScaleMatrix(scale_x, scale_y, scale_z) {
    return new Float32Array([
        scale_x, 0, 0, 0,
        0, scale_y, 0, 0,
        0, 0, scale_z, 0,
        0, 0, 0, 1
    ]);
}

function createTranslationMatrix(x_amount, y_amount, z_amount) {
    return new Float32Array([
        1, 0, 0, x_amount,
        0, 1, 0, y_amount,
        0, 0, 1, z_amount,
        0, 0, 0, 1
    ]);
}

function createRotationMatrix_Z(radian) {
    return new Float32Array([
        Math.cos(radian), -Math.sin(radian), 0, 0,
        Math.sin(radian), Math.cos(radian), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])
}

function createRotationMatrix_X(radian) {
    return new Float32Array([
        1, 0, 0, 0,
        0, Math.cos(radian), -Math.sin(radian), 0,
        0, Math.sin(radian), Math.cos(radian), 0,
        0, 0, 0, 1
    ])
}

function createRotationMatrix_Y(radian) {
    return new Float32Array([
        Math.cos(radian), 0, Math.sin(radian), 0,
        0, 1, 0, 0,
        -Math.sin(radian), 0, Math.cos(radian), 0,
        0, 0, 0, 1
    ])
}

function getTransposeMatrix(matrix) {
    return new Float32Array([
        matrix[0], matrix[4], matrix[8], matrix[12],
        matrix[1], matrix[5], matrix[9], matrix[13],
        matrix[2], matrix[6], matrix[10], matrix[14],
        matrix[3], matrix[7], matrix[11], matrix[15]
    ]);
}

const vertexShaderSource = `
attribute vec3 position;
attribute vec3 normal; // Normal vector for lighting

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;

uniform vec3 lightDirection;

varying vec3 vNormal;
varying vec3 vLightDirection;

void main() {
    vNormal = vec3(normalMatrix * vec4(normal, 0.0));
    vLightDirection = lightDirection;

    gl_Position = vec4(position, 1.0) * projectionMatrix * modelViewMatrix; 
}

`

const fragmentShaderSource = `
precision mediump float;

uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;
uniform float shininess;

varying vec3 vNormal;
varying vec3 vLightDirection;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(vLightDirection);
    
    // Ambient component
    vec3 ambient = ambientColor;

    // Diffuse component
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * diffuseColor;

    // Specular component (view-dependent)
    vec3 viewDir = vec3(0.0, 0.0, 1.0); // Assuming the view direction is along the z-axis
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    vec3 specular = spec * specularColor;

    gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}

`

/**
 * @WARNING DO NOT CHANGE ANYTHING ABOVE THIS LINE
 */



/**
 * 
 * @TASK1 Calculate the model view matrix by using the chatGPT
 */

function getChatGPTModelViewMatrix() {
    const transformationMatrix = new Float32Array([
        0.3535533845424652, 0.6123724575042725, 0.7071067690849304, 0,
        -0.25, 0.4330127239227295, -0.5, 0,
        -0.6123724575042725, 0.3535533845424652, 0.7071067690849304, 0,
        0.3, -0.25, 0, 1
    ]);    
    
    return getTransposeMatrix(transformationMatrix);
}
/*
function getChatGPTModelViewMatrix() {
    const transformationMatrix = new Float32Array([
        [
    0.1767766922712326, -0.3061862071122423,0.3535533845424652,0.30000001192092896,
    0.4633883326744428, 0.0634132435040824,-0.1767766922712326,-0.25,
    0.1268264870081648, 0.780330057776724, 0.6123724142244846, 0,
    0,0,0,1
]
    ]);    
    return getTransposeMatrix(transformationMatrix);
}
*/
/**
 * 
 * @TASK2 Calculate the model view matrix by using the given 
 * transformation methods and required transformation parameters
 * stated in transformation-prompt.txt
 */
function getModelViewMatrix() {
    // calculate the model view matrix by using the transformation
    // methods and return the modelView matrix in this method
    // Conversion function for degrees to radians
    function degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Start with the identity matrix
    var modelViewMatrix = createIdentityMatrix();
    
    // Apply translation
    var translationMatrix = createTranslationMatrix(0.3, -0.25, 0);
    modelViewMatrix = multiplyMatrices(modelViewMatrix, translationMatrix);

    // Apply scaling
    var scalingMatrix = createScaleMatrix(0.5, 0.5, 1);
    modelViewMatrix = multiplyMatrices(modelViewMatrix, scalingMatrix);

    // Apply rotation
    var rotationXMatrix = createRotationMatrix_X(degreesToRadians(30));
    var rotationYMatrix = createRotationMatrix_Y(degreesToRadians(45));
    var rotationZMatrix = createRotationMatrix_Z(degreesToRadians(60));

    modelViewMatrix = multiplyMatrices(modelViewMatrix, rotationXMatrix);
    modelViewMatrix = multiplyMatrices(modelViewMatrix, rotationYMatrix);
    modelViewMatrix = multiplyMatrices(modelViewMatrix, rotationZMatrix);

    console.log(modelViewMatrix);
    return modelViewMatrix; 

    }

/**
 * 
 * @TASK3 Ask CHAT-GPT to animate the transformation calculated in 
 * task2 infinitely with a period of 10 seconds. 
 * First 5 seconds, the cube should transform from its initial 
 * position to the target position.
 * The next 5 seconds, the cube should return to its initial position.
 
function getPeriodicMovement(startTime) {
    // this metdo should return the model view matrix at the given time
    // to get a smooth animation

}
*/

function getPeriodicMovement(startTime) {
    // Duration of the entire animation in seconds
    var animationDuration = 10;

    // Get the current time
    var currentTime = (Date.now() - startTime) / 1000;

    // Calculate the progress of the animation (value between 0 and 1)
    var animationProgress = (currentTime % animationDuration) / animationDuration;

    // Determine whether to apply forward or reverse transformations
    var isForward = animationProgress <= 0.5;

    // Adjust progress for the reverse transformations
    if (!isForward) {
        animationProgress = 1 - animationProgress; // Reverse the progress
    }

    // Apply the transformations based on the progress
    var modelViewMatrix = getModelViewMatrixWithProgress(animationProgress);

    if (currentTime >= 5 && currentTime < 6) {
        console.log("Matrix at 5th second:");
        console.log(getModelViewMatrix());
    }
    return modelViewMatrix;
}

// Function to apply transformations with progress
function getModelViewMatrixWithProgress(progress) {
    // Start with the identity matrix
    var modelViewMatrix = createIdentityMatrix();

    // Apply translation
    var translationMatrix = createTranslationMatrix(0.3 * progress, -0.25 * progress, 0);
    modelViewMatrix = multiplyMatrices(modelViewMatrix, translationMatrix);
    
    // Apply scaling
    var scalingMatrix = createScaleMatrix(1- 0.5*progress , 1- 0.5*progress, 1);
    modelViewMatrix = multiplyMatrices(modelViewMatrix, scalingMatrix);
   
    // Apply rotation
    var rotationXMatrix = createRotationMatrix_X(degreesToRadians(30)*progress);
    var rotationYMatrix = createRotationMatrix_Y(degreesToRadians(45) * progress);
    var rotationZMatrix = createRotationMatrix_Z(degreesToRadians(60) * progress);

    // Combine all rotation matrices
    var rotationMatrix = multiplyMatrices(rotationXMatrix, rotationYMatrix);
    
    rotationMatrix = multiplyMatrices(rotationMatrix, rotationZMatrix);

    modelViewMatrix = multiplyMatrices(modelViewMatrix, rotationMatrix);
    return modelViewMatrix;
}

// Helper function to convert degrees to radians
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}
