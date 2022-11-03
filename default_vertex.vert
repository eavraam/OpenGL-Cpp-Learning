#version 330 core

layout (location = 0) in vec3 aPos;		// Position Coordinates
layout (location = 1) in vec3 aNormal;	// Normals
layout (location = 2) in vec3 aColor;	// Colors
layout (location = 3) in vec2 aTex;		// Texture Coordinates

out vec3 currentPos;	// Outputs the current position for the Fragment Shader
out vec3 Normal;		// Outputs the normals for the Fragment Shader
out vec3 color;			// Outputs the color for the Fragment Shader
out vec2 texCoord;		// Outputs the texture coordinates for the Fragment Shader

// Imports the camera matrix from the main function
uniform mat4 camMatrix;
uniform mat4 model;
uniform mat4 translation;
uniform mat4 rotation;
uniform mat4 scale;


void main()
{
	// Calculates current position
	currentPos = vec3(model * translation * rotation * scale * vec4(aPos, 1.0f));
	// Assigns the normal from the Vertex Data to "Normal"
	Normal = aNormal;
	// Assigns the colors from the Vertex Data to "color"
	color = aColor;
	// Assigns the texture coordinates from the Vertex Data to "texCoord"
	texCoord = mat2(0.0, -1.0, 1.0, 0.0) * aTex;
	
	// Outputs the position/coordinates of all vertices
	gl_Position = camMatrix * vec4(currentPos, 1.0);
}