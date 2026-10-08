erDiagram
    users ||--o{ tasks : "creates"
    users ||--o{ system_settings : "updated_by"
    vehicles ||--o{ tasks : "assigned_to"
    vehicles ||--o{ vehicle_logs : "records"
    tasks ||--o{ task_histories : "tracks"

    users {
        string id PK
        string username
        string email
        string password_hash
        string role "ADMIN | OPERATOR | VIEWER"
        datetime created_at
        datetime updated_at
    }

    vehicles {
        string id PK "AGV-01等"
        string name
        string status "IDLE | RUNNING | CHARGING | ERROR | OFFLINE"
        int battery_level "0-100"
        float current_x
        float current_y
        float current_theta "方位角"
        string current_map_id
        datetime last_heartbeat
        datetime created_at
        datetime updated_at
    }

    tasks {
        string id PK
        string title
        string status "PENDING | ASSIGNED | IN_PROGRESS | COMPLETED | CANCELLED | FAILED"
        int priority "1: Low ~ 5: High"
        string assigned_vehicle_id FK
        string start_location
        string target_location
        string created_by_user_id FK
        datetime scheduled_at
        datetime started_at
        datetime completed_at
        datetime created_at
        datetime updated_at
    }

    vehicle_logs {
        bigint id PK
        string vehicle_id FK
        string log_level "INFO | WARN | ERROR"
        string message
        json details "エラーコードやセンサー生データ"
        datetime timestamp
    }

    task_histories {
        bigint id PK
        string task_id FK
        string status "変更後のステータス"
        string note "状態変更の理由や詳細"
        datetime timestamp
    }

    system_settings {
        string key PK "例: mqtt.broker_url, agv.max_speed"
        string value "JSON形式文字列またはプレーンテキスト"
        string category "GENERAL | AGV | SYSTEM"
        string description
        string updated_by_user_id FK
        datetime updated_at
    }