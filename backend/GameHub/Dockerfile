FROM eclipse-temurin:21.0.3_9-jdk
# definir directorio raiz del contenedor
WORKDIR /app

EXPOSE 8080

# copiar y pegar archivos dentro del contenedor
COPY pom.xml .
COPY .mvn ./.mvn
COPY mvnw .

# descargar dependencias
RUN ./mvnw dependency:go-offline

# copiar codigo fuente dentro del contenedor
COPY src ./src

# construir nuestra aplicacion
RUN ./mvnw clean install -DskipTests


# Renombrar el JAR generado a un nombre fijo
RUN mv /app/target/*.jar /app/app.jar

# levantar la aplicacion cuando el contenedor inicie
ENTRYPOINT ["java","-jar","/app/app.jar"]