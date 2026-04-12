# Logistics Gateway API

물류 배송 관리 시스템 API (NestJS + Prisma 기반)

---

## 📌 프로젝트 소개

배송(Shipment)과 기사(Driver)를 관리하는 백엔드 API 시스템입니다.

배송 상태 전이, 기사 배정, 재배정, workload 관리, 이력 추적까지 포함한  
실무형 물류 도메인 구조를 설계하고 구현하였습니다.

---

## 🛠 기술 스택

- NestJS
- Prisma ORM
- PostgreSQL
- TypeScript

---
REQUESTED → READY → IN_TRANSIT → DELIVERED
- 잘못된 상태 변경 방지
- 상태 변경 이력 기록

---

### 3. 기사 관리 (Driver)
- 기사 등록
- 중복 방지 (전화번호, 차량번호)
- 기사 조회

---

### 4. 기사 배정 시스템
- READY 상태에서만 배정 가능
- 기사 재배정 가능
- workload 자동 관리

---

### 5. Workload 관리
- 배정 시 +1
- 재배정 시 이전 기사 -1 / 신규 기사 +1
- 배송 완료 시 -1

---

### 6. 이력 관리

#### 상태 변경 이력
- ShipmentStatusHistory

#### 배차 이력
- ShipmentAssignHistory

---

## 🔗 주요 API

### 배송 생성
POST /shipments

### 배송 상태 변경
PATCH /shipments/:shipmentNo/status

### 상태 이력 조회
GET /shipments/:shipmentNo/history

### 배차 이력 조회
GET /shipments/:shipmentNo/assign-history

### 기사 조회
GET /drivers/:id

### 기사 담당 배송 조회
GET /drivers/:id/shipments


---

## ⚙️ 설계 포인트

- 상태 전이 제한 (State Machine 적용)
- 트랜잭션 기반 데이터 일관성 보장
- workload 자동 계산 구조
- 관계 기반 조회 (Prisma relation)
- 이력 테이블 분리 (추적 가능성 확보)

---

## 📊 ERD 개념

- Driver 1 : N Shipment
- Shipment 1 : N StatusHistory
- Shipment 1 : N AssignHistory

---

## 🚀 실행 방법

```bash
npm install
npx prisma migrate dev
npm run start:dev

