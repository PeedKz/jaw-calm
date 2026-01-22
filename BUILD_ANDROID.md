# 🤖 Build Android via Docker - JawRelax

## Pré-requisitos

- Docker instalado ([Download](https://docs.docker.com/get-docker/))
- Docker Compose (geralmente já vem com Docker Desktop)
- ~10GB de espaço em disco (Android SDK + dependências)

---

## 🚀 Build Rápido (Recomendado)

### 1. Clonar o projeto

```bash
git clone <seu-repositorio>
cd <pasta-do-projeto>
```

### 2. Criar pasta de output

```bash
mkdir -p output
```

### 3. Build e gerar APK

```bash
docker-compose -f docker-compose.android.yml up --build
```

O APK será gerado em: `./output/app-debug.apk`

---

## 🔧 Build Manual (Alternativa)

### 1. Construir imagem Docker

```bash
docker build -f Dockerfile.android -t jawrelax-android .
```

### 2. Executar container e gerar APK

```bash
docker run -v $(pwd)/output:/app/output jawrelax-android
```

---

## 📱 Instalar no dispositivo Android

### Via ADB (com dispositivo conectado USB)

```bash
adb install ./output/app-debug.apk
```

### Via transferência direta

1. Copie o arquivo `app-debug.apk` para o celular
2. Abra o gerenciador de arquivos no Android
3. Toque no APK e instale (habilite "Fontes desconhecidas" se necessário)

---

## 🏭 Build de Release (Produção)

Para gerar APK assinado para publicação na Play Store:

### 1. Gerar keystore (apenas uma vez)

```bash
keytool -genkey -v -keystore jawrelax-release.keystore -alias jawrelax -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Modificar o comando de build

Edite o `Dockerfile.android`, trocando a última linha para:

```dockerfile
CMD ["sh", "-c", "cd android && ./gradlew assembleRelease && cp app/build/outputs/apk/release/app-release-unsigned.apk /app/output/"]
```

### 3. Assinar o APK

```bash
# Assinar
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore jawrelax-release.keystore output/app-release-unsigned.apk jawrelax

# Alinhar (otimização)
zipalign -v 4 output/app-release-unsigned.apk output/jawrelax-release.apk
```

---

## 🔍 Troubleshooting

### Erro de memória no Gradle

Adicione no `docker-compose.android.yml`:

```yaml
services:
  android-build:
    # ... outras configs ...
    deploy:
      resources:
        limits:
          memory: 4G
```

### Build muito lento

O primeiro build é lento (~15-30 min) devido ao download do Android SDK. Builds subsequentes são mais rápidos devido ao cache do Docker.

### Erro "SDK location not found"

Verifique se as variáveis de ambiente estão corretas no Dockerfile.

---

## 📋 Estrutura de arquivos gerados

```
projeto/
├── output/
│   └── app-debug.apk      # APK gerado
├── android/                # Projeto Android (gerado pelo Capacitor)
├── Dockerfile.android      # Configuração Docker
├── docker-compose.android.yml
└── capacitor.config.ts     # Configuração do Capacitor
```

---

## 🎯 Comandos úteis

```bash
# Limpar cache e rebuildar
docker-compose -f docker-compose.android.yml build --no-cache

# Entrar no container para debug
docker run -it jawrelax-android /bin/bash

# Ver logs detalhados
docker-compose -f docker-compose.android.yml up --build 2>&1 | tee build.log
```

---

## 📲 Configurações do App

- **App ID**: `app.lovable.201a04a3125e42078ddd24b78dbf5673`
- **Nome**: JawRelax
- **Android mínimo**: API 22 (Android 5.1)
- **Target**: API 34 (Android 14)
