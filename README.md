# Logistics Gateway API

NestJS + Prisma + PostgreSQL 기반의 물류 배송 관리 백엔드 API 프로젝트입니다.

배송 생성, 상태 전이, 기사 배정, workload 관리, 이력 추적, JWT 인증 흐름까지 포함한
실무형 물류 도메인 API 구조를 설계하고 구현했습니다.

---

## 프로젝트 소개

이 프로젝트는 배송(Shipment)과 기사(Driver)를 관리하는 물류 시스템 API입니다.

단순 CRUD를 넘어서 다음과 같은 도메인 규칙을 반영했습니다.

- 배송 상태 전이 제어
- 기사 배정 및 재배정
- 기사 workload 자동 계산
- 상태 변경 이력 및 배차 이력 관리
- JWT 기반 인증 및 로그인 사용자 식별

---

## 기술 스택

- NestJS
- Prisma ORM
- PostgreSQL
- TypeScript
- JWT
- Passport
- bcrypt

---

## 핵심 기능

### 1. JWT 인증
- 기사 계정 생성
- 로그인 후 JWT 발급
- 보호 라우트 접근 제어
- 현재 로그인 사용자 조회 (`GET /auth/me`)

### 2. 배송 관리
- 배송 생성
- 배송 단건 조회
- 배송 목록 조회

### 3. 배송 상태 전이
- 상태 흐름:
  `REQUESTED → READY → IN_TRANSIT → DELIVERED`
- 잘못된 상태 변경 방지
- 상태 변경 사유 기록
- 상태 변경 이력 저장
- `changedBy` 를 로그인 사용자 기준으로 자동 기록

### 4. 기사 관리
- 기사 등록
- 전화번호 / 차량번호 중복 방지
- 기사 조회
- 로그인 기사 기준 내 정보 조회

### 5. 기사 배정 시스템
- READY 상태에서만 배정 가능
- 기사 재배정 가능
- 기사 workload 자동 반영

### 6. 내 배송 조회
- JWT 인증 기반 내 배송 조회
- 로그인 사용자 기준 기사 ID 식별
- `GET /drivers/me/shipments`

### 7. 이력 관리
- 상태 변경 이력: `ShipmentStatusHistory`
- 기사 배정 이력: `ShipmentAssignHistory`

---

## 주요 API

### 인증
- `POST /auth/login`
- `GET /auth/me`

### 기사
- `POST /drivers`
- `GET /drivers/:id`
- `GET /drivers/:id/shipments`
- `GET /drivers/me/shipments`

### 배송
- `POST /shipments`
- `GET /shipments`
- `GET /shipments/:shipmentNo`

### 상태 / 배정 / 이력
- `PATCH /shipments/:shipmentNo/status`
- `PATCH /shipments/:shipmentNo/assign-driver`
- `GET /shipments/:shipmentNo/history`
- `GET /shipments/:shipmentNo/assign-history`

---

## 설계 포인트

- 상태 전이 제한을 통한 도메인 규칙 반영
- Prisma Transaction 기반 데이터 일관성 처리
- 기사 workload 자동 계산
- JWT 인증 기반 보호 라우트 구성
- 로그인 사용자 기준 데이터 조회 구조
- 이력 테이블 분리로 추적 가능성 확보

---

## ERD 개념

- Driver 1 : N Shipment
- Shipment 1 : N ShipmentStatusHistory
- Shipment 1 : N ShipmentAssignHistory

---

## 실행 방법

```bash
npm install
npx prisma migrate dev
npm run start:dev
