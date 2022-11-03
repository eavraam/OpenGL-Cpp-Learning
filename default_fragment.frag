#version 330 core

out vec4 FragColor;

in vec3 currentPos;			// Imports the current position from the Vertex Shader
in vec3 Normal;				// Imports the normal coordinates from the Vertex Shader
in vec3 color;				// Imports the color from the Vertex Shader
in vec2 texCoord;			// Imports the texture coordinates from the Vertex Shader


uniform sampler2D diffuse0;		// Gets the Texture Unit from the main function
uniform sampler2D specular0;		// Gets the Texture Unit from the main function


uniform vec4 lightColor;	// Get the color of the light from the main function
uniform vec3 lightPos;		// Get the position of the light from the main function
uniform vec3 camPos;		// Get the color of the camera from the main function

vec4 pointLight()
{
	vec3 lightVec = lightPos - currentPos;

	// intensity of light with respect to distance
	float dist = length(lightVec);
	float a = 3.0;
	float b = 0.7;
	float intensity = 1.0f / (a * dist * dist + b * dist + 1.0f); // 1/(a*dist^2 + b*dist + 1)

	// ambient lighting
	float ambient = 0.2f;

	// diffuse lighting
	vec3 normal = normalize(Normal);
	vec3 lightDirection = normalize(lightVec);
	float diffuse = max(dot(normal, lightDirection), 0.0f);

	// specular lighting
	float specularLight = 0.5f;
	vec3 viewDirection = normalize(camPos - currentPos);
	vec3 reflectionDirection = reflect(-lightDirection, normal);
	float specAmount = pow(max(dot(viewDirection, reflectionDirection), 0.0f), 16);
	float specular = specAmount * specularLight;

	// specular0 is a single color/channel texture, so we just add its "red" value (.r)
	return (texture(diffuse0, texCoord) * lightColor * (diffuse * intensity + ambient)
				+ texture(specular0, texCoord).r * specular * intensity) * lightColor;
}

vec4 directionalLight()
{
	// ambient lighting
	float ambient = 0.2f;

	// diffuse lighting
	vec3 normal = normalize(Normal);
	// We give a constant normalized vector instead of lightVec this time
	// Note that due to the followign code, it should point to the opposite 
	// direction of where we want to point, so UP if I want to illuminate DOWN
	vec3 lightDirection = normalize(vec3(1.0f, 1.0f, 0.0f));
	float diffuse = max(dot(normal, lightDirection), 0.0f);

	// specular lighting
	float specularLight = 0.5f;
	vec3 viewDirection = normalize(camPos - currentPos);
	vec3 reflectionDirection = reflect(-lightDirection, normal);
	float specAmount = pow(max(dot(viewDirection, reflectionDirection), 0.0f), 16);
	float specular = specAmount * specularLight;

	// specular0 is a single color/channel texture, so we just add its "red" value (.r)
	return (texture(diffuse0, texCoord) * (diffuse + ambient)
				+ texture(specular0, texCoord).r * specular) * lightColor;
}

vec4 spotLight()
{
	// controls how big the area that is lit up is
	float outerCone = 0.90f;
	float innerCone = 0.95f;

	// ambient lighting
	float ambient = 0.2f;

	// diffuse lighting
	vec3 normal = normalize(Normal);
	vec3 lightDirection = normalize(lightPos - currentPos);
	float diffuse = max(dot(normal, lightDirection), 0.0f);

	// specular lighting
	float specularLight = 0.5f;
	vec3 viewDirection = normalize(camPos - currentPos);
	vec3 reflectionDirection = reflect(-lightDirection, normal);
	float specAmount = pow(max(dot(viewDirection, reflectionDirection), 0.0f), 16);
	float specular = specAmount * specularLight;

	// calculates the intensity of the currentPos based on its angle to the center of the light cone
	float angle = dot(vec3(0.0f, -1.0f, 0.0f), -lightDirection);
	float intensity = clamp((angle - outerCone) / (innerCone - outerCone), 0.0f, 1.0f);


	// specular0 is a single color/channel texture, so we just add its "red" value (.r)
	return (texture(diffuse0, texCoord) * (diffuse * intensity + ambient)
				+ texture(specular0, texCoord).r * specular * intensity) * lightColor;
}

void main()
{
	// Outputs final color
	FragColor = spotLight();
}