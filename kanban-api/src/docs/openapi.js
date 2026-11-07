module.exports = {
  "openapi": "3.0.3",
  "info": {
    "title": "Kanban API",
    "version": "1.1.0",
    "description": "API REST para gerenciamento de tarefas de um quadro Kanban. Os dados são persistidos em PostgreSQL."
  },
  "servers": [
    {
      "url": "/",
      "description": "Servidor atual"
    }
  ],
  "tags": [
    {
      "name": "Health",
      "description": "Verificação de disponibilidade da API"
    },
    {
      "name": "Tasks",
      "description": "Operações de gerenciamento de tarefas"
    }
  ],
  "paths": {
    "/health": {
      "get": {
        "tags": [
          "Health"
        ],
        "summary": "Verifica se a API está ativa",
        "operationId": "getHealth",
        "responses": {
          "200": {
            "description": "API ativa",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HealthResponse"
                }
              }
            }
          }
        }
      }
    },
    "/ready": {
      "get": {
        "tags": [
          "Health"
        ],
        "summary": "Verifica a conexão com o banco de dados",
        "operationId": "getReadiness",
        "responses": {
          "200": {
            "description": "Banco de dados conectado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ReadyResponse"
                }
              }
            }
          },
          "503": {
            "description": "Banco de dados indisponível",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotReadyResponse"
                }
              }
            }
          }
        }
      }
    },
    "/tasks": {
      "get": {
        "tags": [
          "Tasks"
        ],
        "summary": "Lista todas as tarefas",
        "operationId": "listTasks",
        "parameters": [
          {
            "name": "status",
            "in": "query",
            "required": false,
            "description": "Filtra tarefas por status",
            "schema": {
              "type": "string",
              "enum": [
                "backlog",
                "in-progress",
                "done"
              ]
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Lista de tarefas",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Task"
                  }
                }
              }
            }
          },
          "400": {
            "description": "Status inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "Tasks"
        ],
        "summary": "Cria uma tarefa",
        "operationId": "createTask",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateTaskInput"
              },
              "example": {
                "title": "Implementar autenticação",
                "status": "backlog"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Tarefa criada",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Task"
                }
              }
            }
          },
          "400": {
            "description": "Dados inválidos",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                }
              }
            }
          }
        }
      }
    },
    "/tasks/{id}": {
      "put": {
        "tags": [
          "Tasks"
        ],
        "summary": "Atualiza o status de uma tarefa",
        "operationId": "updateTaskStatus",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "minimum": 1
            },
            "description": "ID da tarefa"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateTaskInput"
              },
              "example": {
                "status": "in-progress"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Tarefa atualizada",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Task"
                }
              }
            }
          },
          "400": {
            "description": "ID ou status inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                }
              }
            }
          },
          "404": {
            "description": "Tarefa não encontrada",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "Tasks"
        ],
        "summary": "Exclui uma tarefa",
        "operationId": "deleteTask",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "minimum": 1
            },
            "description": "ID da tarefa"
          }
        ],
        "responses": {
          "204": {
            "description": "Tarefa excluída"
          },
          "400": {
            "description": "ID inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                }
              }
            }
          },
          "404": {
            "description": "Tarefa não encontrada",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Task": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64",
            "example": 1
          },
          "title": {
            "type": "string",
            "maxLength": 255,
            "example": "Implementar autenticação"
          },
          "status": {
            "type": "string",
            "enum": [
              "backlog",
              "in-progress",
              "done"
            ],
            "example": "backlog"
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "example": "2026-11-07T12:00:00.000Z"
          }
        },
        "required": [
          "id",
          "title",
          "status",
          "created_at"
        ]
      },
      "CreateTaskInput": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string",
            "minLength": 1,
            "maxLength": 255,
            "example": "Implementar autenticação"
          },
          "status": {
            "type": "string",
            "enum": [
              "backlog",
              "in-progress",
              "done"
            ],
            "default": "backlog"
          }
        },
        "required": [
          "title"
        ]
      },
      "UpdateTaskInput": {
        "type": "object",
        "properties": {
          "status": {
            "type": "string",
            "enum": [
              "backlog",
              "in-progress",
              "done"
            ],
            "example": "in-progress"
          }
        },
        "required": [
          "status"
        ]
      },
      "Error": {
        "type": "object",
        "properties": {
          "error": {
            "type": "string",
            "example": "Mensagem de erro"
          }
        }
      },
      "HealthResponse": {
        "type": "object",
        "properties": {
          "status": {
            "type": "string",
            "example": "ok"
          },
          "service": {
            "type": "string",
            "example": "kanban-api"
          }
        }
      },
      "ReadyResponse": {
        "type": "object",
        "properties": {
          "status": {
            "type": "string",
            "example": "ready"
          },
          "database": {
            "type": "string",
            "example": "connected"
          }
        }
      },
      "NotReadyResponse": {
        "type": "object",
        "properties": {
          "status": {
            "type": "string",
            "example": "not_ready"
          },
          "database": {
            "type": "string",
            "example": "unavailable"
          }
        }
      }
    }
  }
};
