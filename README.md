# Measurement Service API

## Descrição
Este projeto é uma API para gerenciar medições de água e gás. Ele permite o upload de imagens de medidores, análise de texto nas imagens para extrair valores de medição, confirmação de medições e listagem de medições por cliente.

## Funcionalidades
- **Upload de Medições**: Envia uma imagem de um medidor e salva a medição extraída.
- **Confirmação de Medições**: Confirma o valor de uma medição existente.
- **Listagem de Medições**: Lista todas as medições realizadas por um cliente, com opção de filtrar por tipo de medição (água ou gás).

## Tecnologias Utilizadas
- Node.js
- TypeScript
- Express
- Docker
- Google Cloud Vision API


## Instalação

### Pré-requisitos
- Node.js
- Docker
- Conta no Google Cloud com a API Vision habilitada

### Passos

1. Clone o repositório:
    ```sh
    git clone <URL_DO_REPOSITORIO>
    cd <NOME_DO_REPOSITORIO>
    ```

2. Crie um arquivo `.env` na raiz do projeto com a seguinte variável:
    ```env
    GEMINI_API_KEY=<sua_chave_da_api>
    ```

3. Construa e inicie os containers Docker:
    ```sh
    docker-compose up --build
    ```

A API estará disponível em `http://localhost:3000`.

## Endpoints

### Upload de Medição
- **URL**: `/upload`
- **Método**: `POST`
- **Body**:
    ```json
    {
        "image": "base64string",
        "customer_code": "string",
        "measure_datetime": "datetime",
        "measure_type": "WATER" | "GAS"
    }
    ```
- **Respostas**:
    - `200 OK`: Medição salva com sucesso.
    - `400 Bad Request`: Dados inválidos.
    - `409 Conflict`: Medição já existe para o mês e tipo especificado.
    - `500 Internal Server Error`: Erro inesperado.

### Confirmação de Medição
- **URL**: `/confirm`
- **Método**: `PATCH`
- **Body**:
    ```json
    {
        "measure_uuid": "string",
        "confirmed_value": "number"
    }
    ```
- **Respostas**:
    - `200 OK`: Medição confirmada com sucesso.
    - `400 Bad Request`: Dados inválidos.
    - `404 Not Found`: Medição não encontrada.
    - `409 Conflict`: Medição já confirmada.
    - `500 Internal Server Error`: Erro inesperado.

### Listagem de Medições
- **URL**: `/:customer_code/list`
- **Método**: `GET`
- **Query Params**:
    - `measure_type` (opcional): `WATER` | `GAS`
- **Respostas**:
    - `200 OK`: Lista de medições.
    - `400 Bad Request`: Tipo de medição inválido.
    - `404 Not Found`: Nenhuma medição encontrada.
    - `500 Internal Server Error`: Erro inesperado.

## Contribuição
1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`).
4. Faça o push para a branch (`git push origin feature/nova-feature`).
5. Crie um novo Pull Request.

## Licença
Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.


