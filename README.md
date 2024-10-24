# Laboratorio 07- Seguridad
*Integrantes:*

*-Andrea Camila Torres Gonzales.*

*-Jorge Andrés Gamboa Sierra.*

*-Jaider David Vargas Noriega.*

*-Laura Sofia Gil Chaves.*

## Parte I: Azure
Se actualizó el plan del proyecto en Azure DevOps.

![image](https://github.com/user-attachments/assets/6e77b939-2626-48e3-bb6d-a63d9fb1ada6)

## Parte II: Spring Security

### 1. Protección de Seguridad
Se ha implementado Spring Security en el proyecto para proteger las rutas de acceso y gestionar la autenticación y autorización de los usuarios. A continuación, se detallan los ajustes y el código implementado para garantizar la seguridad en la aplicación.

### 1.1. Configuración de Spring Security
Configuración de Seguridad General: En el archivo de configuración de seguridad se ha implementado un sistema de autenticación y autorización, donde se define el acceso a los diferentes endpoints de la aplicación basado en roles de usuario, todo esto mediante  JWT (JSON Web Token).

***1. Clase AuthResponse:***  Esta clase representa la respuesta que se devuelve al cliente después de un proceso de autenticación exitoso. Incluye dos campos principales:
   
 -token: El token JWT que se envía al cliente para su uso en futuras solicitudes.
 -userId: El ID del usuario autenticado.

***2. Clase JwtAuthenticationFilter:*** Este es un filtro personalizado de seguridad que se ejecuta en cada solicitud HTTP para verificar si la solicitud contiene un token JWT válido.

 - Método doFilterInternal: Aquí es donde ocurre la lógica principal. Obtiene el token de la solicitud, extrae el nombre de usuario y verifica si es válido. Si el token es correcto, crea una autenticación UsernamePasswordAuthenticationToken y la establece en el contexto de seguridad de Spring, permitiendo que la solicitud proceda como autenticada.
    
- Método getTokenFromRequest: Extrae el token JWT del encabezado de autorización en la solicitud HTTP. Si el encabezado comienza con Bearer , se retorna el token sin el prefijo. Si no, retorna null.

***3. Clase LoginRequest:*** Representa la solicitud de inicio de sesión de un usuario. Contiene dos campos:

 -username: El nombre de usuario.
 -passwd: La contraseña del usuario.

***4. Clase RegisterRequest:***  Representa la solicitud de registro de un nuevo usuario. Contiene:

 -username: Nombre de usuario.
 -email: Dirección de correo electrónico.
 -passwd: Contraseña del usuario.

***5. Clase SecurityConfig:***  Configura la seguridad en la aplicación utilizando Spring Security. Los aspectos clave de esta clase son:

 - Método securityFilterChain: Configura la cadena de seguridad, deshabilitando CSRF (porque se está utilizando autenticación JWT,  que no requiere esto), permitiendo el acceso público a las rutas bajo /auth/ y protegiendo todas las demás rutas.
      
 - Filtro JwtAuthenticationFilter: Este filtro se agrega antes de la autenticación estándar con nombre de usuario y contraseña para asegurarse de que el token JWT sea verificado antes de cualquier autenticación.

***6. Clase AuthService:***  Esta clase maneja las operaciones de autenticación y registro de usuarios.

 - Método register: Registra un nuevo usuario, asegurándose de que el nombre de usuario y el correo electrónico no estén ya en uso. También valida que la contraseña cumpla con los requisitos de seguridad (al menos 8 caracteres, una letra mayúscula, un número y un carácter especial). Una vez registrado, se genera un token JWT y se devuelve en una AuthResponse junto con el ID del usuario.
 
 - Método login: Autentica a un usuario. Si el usuario y la contraseña son correctos, genera un token JWT y lo devuelve.
	  
 - Método createUser: Crea un nuevo usuario en la base de datos, codificando la contraseña antes de almacenarla.
	  
 - Método isValidPassword: Verifica si la contraseña cumple con los requisitos de seguridad (formato regex).
      
***7. Clase JwtService:***  Esta clase es responsable de generar y validar los tokens JWT.

 - Método getToken: Genera un token JWT basado en los detalles del usuario.
 
 - Métodos auxiliares:
 
	 -getUsernameFromToken: Extrae el nombre de usuario del token JWT.
	 
	 -isTokenValid: Valida si el token es correcto y no ha expirado.
	 
	 -extractClaim: Extrae un reclamo específico del token JWT, como el nombre de usuario o la fecha de expiración.

La clave secreta para la firma del token está definida en la constante SECRET_KEY, y se utiliza el algoritmo HS256 para firmar el token.

### Funcionamiento General
El flujo general de autenticación es el siguiente:

 1. Un usuario se registra o inicia sesión mediante un endpoint, enviando una LoginRequest o RegisterRequest.
 
 2.  En caso de éxito, se devuelve una AuthResponse que contiene un token JWT y el userId.
 
 3. En las solicitudes posteriores, el cliente envía este token en el encabezado de autorización.

 4. El filtro JwtAuthenticationFilter intercepta las solicitudes y valida el token antes de permitir el acceso a recursos protegidos.
   
## 1.2. Resumen de Roles y Funcionalidades

En la aplicación de tareas, la seguridad se implementa con dos roles principales: USER y ADMIN, cada uno con diferentes niveles de acceso y funcionalidades.

**Roles:**

***USER:*** Tiene acceso a las rutas relacionadas con la administración y visualización de sus tareas.

Funcionalidades:

- Ver y gestionar sus propias tareas.

***ADMIN:***  Tiene acceso a rutas más avanzadas, incluyendo paneles de control y gráficos de la aplicación.

Funcionalidades:

- Ver estadísticas y gráficos relacionados con la gestión de tareas.
- Gestionar a otros usuarios y tareas dentro de la aplicación.


**Administración y visualización de tareas personales.**

***/login:***  Ruta accesible para todos los usuarios, utilizada para iniciar sesión en la aplicación.

**Mecanismos de seguridad:**

- Autenticación: Se implementa mediante una autenticación basada en usuarios en memoria, con contraseñas encriptadas con BCrypt.

- Autorización: Las rutas están protegidas según los roles, asegurando que los usuarios solo accedan a las funcionalidades que les corresponden.

## Parte III: Certificados SSL

1. Generar el certificado autofirmado
   
    - El primer paso sigue siendo generar el archivo keystore.p12
  
      ![image](https://github.com/user-attachments/assets/c03142e6-3b01-400c-8d22-10e7d4cc53ae)
      ![image](https://github.com/user-attachments/assets/9670b42e-38ea-43c0-b104-eab7752f1910)

2. Ubicar el archivo keystore
   
    - Una vez generado el archivo keystore.p12,  se coloco en la carpeta src/resources del proyecto.

3. Configuración de application.properties
   
    - En el archivo application.properties, se debe agregar las propiedades necesarias para que Spring Boot utilice el certificado SSL que se genero. Estas configuraciones deben habilitar el uso de HTTPS en lugar de HTTP.
 
      ![image](https://github.com/user-attachments/assets/e881bcf9-21df-43c3-bc70-e7364ed9f1b0)

 4. Certificado autofirmado

    ![image](https://github.com/user-attachments/assets/dc889801-7d9f-4c2b-a581-4e268790305d)


      
