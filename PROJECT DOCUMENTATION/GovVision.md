Here is the converted Markdown document. The formatting has been cleaned up, paragraphs joined for readability, tables converted to standard Markdown syntax, and pseudocode placed into code blocks.

---

# 1. INTRODUCTION

The Analytics, Reporting & Management Monitoring System with ML Insights is a dedicated module of the Gov-Vision, which is an enterprise platform designed to improve the level of analysis, transparency, and accountability in an organization's decision making. It implements a Role-based access in the platform that ensures authorized personnel get the right information at the right time, supported by clear data such as KPIs that measure the performance across the organization.

Most organizations even today rely on manual spreadsheets, delayed reporting, and intuition-led decision making, which results in bottlenecks, compliance risk, low performance risk, and ultimate failure of tasks due to risk going undetected for long. This module solves the problem by serving as the central analytical and visibility layer of the platform Gov-Vision, by processing raw decision data into clear insights for executive, management, compliance officer, analyst, and department heads.

While the entire Gov-Vision framework manages the entire process of decision-making including decision creation, approval, and compliance, this module focuses on the analytics and monitoring aspect of Gov-Vision by computing key performance indicators (KPIs) that are monitored in decision-making processes, as well as departmental performance and policy compliance for effective governance with real-time monitoring. This module is integrated with the Gov-Vision system through RESTful API calls and operates as a micro-service in the Gov-Vision.

Key capabilities include executive dashboards featuring decision metrics, approval timelines, KPI performance, and risk indicators; ML-based anomaly detection that detects abnormal patterns within the approval process; prediction models predicting the possibility of an approval delay before it happens; and ML-driven risk scoring where risk profiles are dynamically assessed for different departments and decisions types. Role-based reporting functionality ensures automatic generation of reports delivered periodically in formats including PDF, Excel, and CSV, together with role-based access control over the platform ensuring visibility of relevant data based on roles and authorization of the individual.

## 1.1. General overview of the problem

Enterprise governance environments even today lack a real-time centralized analytical system for transforming decision-making raw data into usable management information. Organizations that look for an insight about approval workflow or KPI outcomes or if they must check the compliance, they use manually made spreadsheets together with reports that are collected from different systems. This method is slow and not reliable. Governance data has a critical role in the operations, so if no automation is there, bottlenecks stay invisible, compliance misses occur and performance issues might get worse when they are not addressed properly.

Moreover, there is no automatic mechanism to flag spikes in approval delay of recurring anomalies, unusual rejection patterns or sudden deterioration in compliance against historical departmental baselines. There is no mechanism to predict potential workflow bottlenecks before they happen, nor a continuous risk scoring system to categorize departmental risk levels in real time. Without these capabilities, management can only take a reactive stance, responding to failures after they have happened.

The decision data is fragmented across multiple systems and spreadsheets with no unified view available for executives to analyze and take insights. All these shortcomings collectively highlight the need for an integrated analytics and monitoring platform with ML integration such as the Gov-Vision Analytics Module.

## 1.2. Feasibility Study

### 1.2.1. Technical Feasibility

The module is technically feasible because it is based on modern web technologies which are well suited for scalable, data-driven and ML integrated applications. The React.js frontend with Recharts and Apache ECharts handles complex visualizations in real time. Backend: Node.js/Express.js with API orchestration. ML services based on Python (scikit-learn, Prophet) integrated through REST for anomaly detection and forecasting. These are all well-documented technologies and widely used.

### 1.2.2. Operational Feasibility

The system is made to be user-friendly. Dashboards automatically fill in according to user identification and are role-based. Users don't need to be data experts because ML insights appear as straightforward alerts and summaries rather than as raw model outputs. This reduces the need for training and makes using the system easier.

### 1.2.3. Economic Feasibility

The costs of development are reasonable and include open-source technologies. Open-source libraries (scikit-learn, Prophet) are essential to the ML components. The project's suggested timeline fits the estimated development timeline.

## 1.3. Literature Survey

**Table 1: Literature Study**

| Author(s) & Year | Full Title | Key Findings | Relevance to Our Project | Gaps Identified |
| --- | --- | --- | --- | --- |
| Dachepalli, V. (2025) [1] | AI-Driven Decision Support Systems in ERP | Used supervised machine learning models (regression, decision trees, ensemble methods) and time-series forecasting for predictive analytics within ERP systems. | Aligns with our ML Insights module, which also uses ML-based predictive analytics to improve enterprise decision quality. | No governance workflow, no policy validation engine, no audit trail, and no structured decision lifecycle integration. |
| Herreros-Martínez A, Magdalena-Benedicto R, Vila-Francés J, et al., (2025) [2] | Applied Machine Learning to Anomaly Detection in Enterprise Purchase Processes, A Hybrid Approach Using Clustering and Isolation Forest | Used Clustering (unsupervised learning) and Isolation Forest for anomaly detection in enterprise purchase data. Improved identification of irregular and fraudulent patterns. | Supports our ML Anomaly Detection module, which also applies Isolation Forest for governance anomaly flagging. | Limited to anomaly detection; no governance workflow, dashboards, forecasting, or decision lifecycle integration. |
| Andrea Kolková & Aleksandr Ključnikov, (2022) [3] | Demand Forecasting: AI-Based, Statistical and Hybrid Models vs Practice-Based Models | Compared ARIMA, ETS, TBATS, Artificial Neural Networks (ANN), Hybrid models, and Prophet forecasting. Used RMSE, MAE, and MASE for evaluation. Found Prophet effective for enterprise-scale forecasting. | Justifies our use of Prophet model for Predictive Delay Forecasting. Supports time-series modelling and performance validation techniques in enterprise environments. | Focused only on demand forecasting. No governance engine, no compliance automation, no risk scoring integration, and no decision lifecycle management. |
| Boning Huang et al., (2021) [4] | Enterprise Risk Assessment Based on Machine Learning | Developed enterprise risk models using Random Forest, Support Vector Machine (SVM), and AdaBoost. Used structured financial indicators as features for supervised classification. Demonstrated improved risk prediction accuracy. | Strongly aligns with our ML Risk Scoring module, which uses Random Forest for governance risk classification. Similar supervised ML training on structured indicators. | Focused only on financial risk classification. No governance policy enforcement, workflow automation, audit tracking, or real-time enterprise dashboard integration. |
| Dheerendra Yaganti, 2020 [5] | A Modular Python-Based Framework for Real-Time Enterprise KPI Visualization Using Pandas and Interactive Dashboards | Proposed a modular analytics framework using Pandas for data processing, Matplotlib and Plotly for visualization, and API-based ingestion. Used structured KPI aggregation and dashboard rendering techniques. | Supports Analytics & Dashboard module, which uses structured data processing and visualization techniques. Aligns with modular architecture and real-time KPI analytics implementation. | No machine learning models used. No governance rule validation, predictive forecasting, risk scoring, or decision lifecycle workflow integration. |

## 1.4. Problem Definition

Organizational decision making in enterprise environments produces structured, measurable data at each state of execution. Each decision follows a structured multi-stage workflow, for example: Submitted → Under Review → L1 Approval → L2 Approval → Approved or Rejected, which producing quantifiable measurable attributes such as timestamps, stage durations, reviewer identifiers, rejection reasons, SLA deviations, revision counts, and compliance indicators.

The key problem is the lack of a system that can continuously consume and read the process workflow, and transform the data into managerial insights in real time. The Decision Management & Workflow System and the Governance, Policy & Compliance Engine digitizes and stores the entire decision lifecycle but the data generated is not utilized as it is stored in MongoDB collections and does not have an automated analytics pipeline for computing KPIs, detecting anomalies or predicting future outcomes. As a result, management still depends on manually prepared reports and spreadsheets that are delayed, error-prone and unable to reflect real-time operational status. The absence of machine learning techniques such as anomaly detection, predictive delay forecasting and risk classification is a critical gap in proactive governance.

## 1.5. Analysis of the Problem

Enterprise platforms and traditional systems that handle governance and decision management commonly struggle with the following problems:

### 1.5.1. Absence of Real Time KPI Computation

Key Performing Indicators such as Average Approval Time, Bottleneck Rate (percentage of decisions stuck after SLA limits in comparison with all other active decisions), Compliance Rate, Rejection Rate, and Decision Throughput are calculated via a manual process using a spreadsheet. Such an approach cannot produce the update frequency that is necessary for real-time governance. By the time the manually generated report on the KPIs is submitted to the decision maker, the current situation in the organization could already be quite different from what the report portrays.

### 1.5.2. Absence of Multi Metric Anomaly Detection

There is no automated mechanism or algorithm that can recognize when the decision-making behavior of a department strays from its usual pattern on several simultaneous measurements. It could be a simple delayed decision, but a department for example whose average decision-making time stands at 9.8 days as opposed to 2.3 days previously, and with an increase in the rate of rejection from 5% to 29%, presents a governance problem that cannot be ignored.

### 1.5.3. Absence of Predictive Delay Forecasting

Management normally takes measures regarding workflow bottlenecks once the delay starts accumulating and escalates into workflow hinderance. There is nothing that can indicate which departments are going to experience such problems within the coming few weeks, considering their present rate of decision intake and past performance trends.

### 1.5.4. Absence of Continuous Automated Risk Scoring

The risk level of a department in relation to other departments under the organization system is manually assessed on a quarterly basis by the compliance officer in charge of the department. As such, there is a structure gap in monitoring that extends for a period of up to three months in which a department’s risk level might deteriorate from low to high without triggering any warning.

### 1.5.5. Absence of Automated Report Generation

The production or generation of an organization reports involve manual data entry, data reformatting in spreadsheet applications, and delivery of report through mail. This process creates inaccuracies, requires considerable work by analysts for every cycle of reporting, and makes it impossible to produce reports on demand.

### 1.5.6. Fragmentation of Cross Department or Module Governance Data

The Decision lifecycle, compliance violation, and policies definition data are distributed across different independent organizational information systems, and there is no common analytics layer. Managers have to go through various interfaces to create a picture of organization's activity; however, even with this approach, they are able to get only a snapshot or a brief overview and not a dynamic picture.

## 1.6. Solution Strategy

The Gov-Vision Analytics Module addresses the above-described failure and shortcoming in traditional organization systems through implementation of the following approaches:

### 1.6.1. Automated Real-Time KPI Computation

The manual computation of KPI is replaced by an automated data aggregation engine, which constantly reads the data input from decision and compliance modules, calculates all KPIs, and stores them into the time series database (snapshot). The updates of KPIs happen both periodically and in response to receiving the state change messages via webhooks.

### 1.6.2. Anomaly Detection via Isolation Forest

A multi-metric anomaly detection is achieved by using the Isolation Forest algorithm trained on historical decision records. Anomalous decisions are identified quicker and obtain a higher anomaly score. Four behavioral metrics are considered: approval cycle time, rejection rate, revision count and days over SLA. Identified anomalies are grouped into levels of priority and delivered to management in the form of real-time dismissible alerts.

### 1.6.3. Time-Series Delay Forecasting via Prophet

A multi-target time-series forecasting prediction capability is implemented using the Meta Prophet model, trained per department based on historical decision throughput data. The generated forecast is done over a period of 7 days, 14 days, and 30 days, including a confidence interval range, allowing an organization to foresee when departments are nearing their capacity limit.

### 1.6.4. Risk Classification via Random Forest

The continuous risk score computation for departmental risk is implemented by applying a supervised Random Forest algorithm based on labeled historical governance records. The system operates on a 24-hour cycle, delivering a current risk score (Low, Medium, High or Critical) for every existing department along with feature ranking information.

### 1.6.5. On Demand Report Generation

The process of manually generating reports is replaced with a report generation engine that creates organization reports in PDF, Excel, and CSV formats either on-demand or scheduled according to users' preferences. Organization reports are created automatically based on pre-aggregated data including KPI summary, anomaly log, compliance rate, and risk category.

### 1.6.6. Unified Real Time Governance Observation Layer

Data fragmentation across modules and departments will be overcome by creating a Gov-Vision Analytics Module that will serve as the observability layer on the platform. The KPI snapshots, anomaly detections, risk assessments, and predictions will be combined into a dashboard view resulting in a single, constantly updating, and role-based access view.

## 1.7. Software Requirement Specifications (SRS)

### 1.7.1. Functional Requirements

**R1: Executive KPI Dashboard**

* **Description:** The system provides an executive dashboard in real time displaying KPIs related to decision-making governance across all organization's departments.
* **Inputs:** Decision data from `m1_decisions`, compliance violation data from `m2_violations`, department filter parameter, and date range.
* **Outputs:** Ten live KPI metric cards; Total Decisions, Approval Rate (%), Rejection Rate (%), Average Approval Time (hours), Bottleneck Rate (%), Compliance Rate (%), Violation Count, Decision Throughput (decisions/day), Anomaly Count, and Risk Score (label).
* **Process:** KPI calculations are event-driven via webhooks. The system aggregates data, saves to `m3_kpi_snapshots`, and sends the updated payload to connected dashboard clients over WebSocket.

**R2: Anomaly Detection and Alert System**

* **Description:** The system identifies and flags any abnormal patterns for active and completed decisions automatically based on trained Isolation Forest model.
* **Input:** Decision feature vectors extracted from `m1_decisions`.
* **Output:** Anomaly result (anomalyScore, isAnomaly boolean, and severity level) for each decision displayed on the dashboard.
* **Process:** Detection occurs via webhooks on state changes and via a daily midnight cron job. The FastAPI service applies the persisted StandardScaler and computes anomalies.

**R3: Predictive Delay Forecasting**

* **Description:** The system uses Meta Prophet for forecasting future decision throughput by each department over three prediction windows: 7-day, 14-day, and 30-day.
* **Input:** Time series snapshots of historical KPIs from `m3_kpi_snapshots`.
* **Output:** Predicted decision counts (`yhat`), lower confidence bound, and upper confidence bound values visually presented on the Forecast Dashboard.
* **Process:** A weekly cron job collects active departments and throughput time series, sending data to the FastAPI forecast endpoint to train/predict the Prophet model.

**R4: Machine Learning Driven Risk Classification**

* **Description:** The system uses a Random Forest classifier to classify each department's risk level.
* **Input:** Each department's feature vector from `m3_kpi_snapshots` and `m2_violations`.
* **Output:** Returns a risk label (Low, Medium, High, or Critical), along with a breakdown of feature importance percentage.
* **Process:** A daily cron job retrieves the feature vectors, sends them to the FastAPI service for inference, writes the risk level back to the database, and triggers a WebSocket event.

**R5: Automated Report Generation**

* **Description:** This system implements an assembly engine that automates generation of reports either on demand or scheduled in PDF, Excel or CSV formats.
* **Input:** Report parameters including name, type, format, date range, target departments, and scheduling details.
* **Output:** Generated report file stored on the server, record saved to `m3_reports`, and immediately downloadable.
* **Process:** On-demand via user input or scheduled via `node-cron`. Queries `m3_kpi_snapshots`, `m3_anomalies`, and `m2_violations`, then uses jsPDF, ExcelJS, and json2csv.

### 1.7.2. Non-Functional Requirements

* **Security:** API endpoints are authenticated through JWT. Role-based access control (RBAC) is implemented for anomaly acknowledgement, risk scores, and report generation (Manager/Admin only).
* **Performance:** KPI/anomaly cache keys are invalidated and re-computed immediately after incoming webhook events. WebSocket is used for push notifications to eliminate polling.
* **Reliability:** Try/catch logic is implemented in middleware. Startup hooks check model loading. Failed report generations update status with error messages.
* **Scalability:** Microservices approach separates Node.js backend & FastAPI ML microservice. Redis caching scales independently of MongoDB.
* **Maintainability:** TypeScript strict mode is enforced. Read-only mongoose models handle cross-module read queries to avoid schema divergence.
* **Availability:** Fallback mechanisms use direct MongoDB querying or cached data if specific services (like ML or Redis) become temporarily unavailable.

### 1.7.3. Goal of Implementation

The goal is to deliver a comprehensive, secured, and role-based analytical insights solution helping management monitor real-time KPIs, analyze anomalous workflows, predict future delays, and determine risk levels for proactive governance.

---

# 2. PROJECT PLANNING

## 2.1. Hardware and Software Requirements

**Table 2: Hardware and Software Requirements**

| Category | Specification |
| --- | --- |
| **Hardware Requirements** |  |
| Memory | 16 GB RAM |
| Processor | AMD Ryzen 7 7840HS |
| Storage | 512 GB SSD |
| Graphics Card | NVIDIA GeForce RTX 3050 |
| **Software Requirements** |  |
| Operating System | Windows 11 |
| Frontend | React.js, HTML5, CSS3, TailwindCSS |
| Backend | Node.js, Express.js, FastAPI |
| ML | Python, scikit-learn, Prophet, Pandas, NumPy |
| Analytics & Visualization | Recharts, Apache ECharts |
| Database | MongoDB (Mongoose), Redis |
| Report Generation | jsPDF, ExcelJS, json2csv |
| Scheduling | node-cron |
| Development Tools | VS Code, npm, pip |
| API Testing | Thunder Client |
| Version Control | Git, GitHub |

## 2.2. Team Structure

> **Figure 1:** Team Structure (Visual reference omitted)

## 2.3. Software Development Life Cycle (SDLC)

> **Figure 2:** Agile Software Development Life Cycle
> **Description:** The Module was built using the Agile SDLC model in which each feature development happens in cycles and iterations. Each cycle is focused on building key features e.g. real-time KPI dashboards, anomaly detection, etc., while developing backend components in parallel.

## 2.4. Gantt Chart

> **Figure 3:** Gantt Chart (Visual reference omitted)

---

# 3. DESIGN STRATEGY FOR THE SOLUTION

## 3.1. Use Case Diagram

> **Figure 4:** Use Case Diagram of RBAC of Users
> **Description:** Shows the interaction of six actors with the ten main use cases. It provides role-based access to real-time KPI dashboards, alert management, custom report creation, and predictive analytics.

## 3.2. Activity Diagram: KPI Aggregation

> **Figure 5.1:** Activity Diagram: Live Update of KPI Aggregation and Dashboard Refresh Workflow
> **Description:** Shows the event-driven KPI aggregation pipeline triggered by decision status change events. The system calculates KPI values and stores the state as a snapshot.

## 3.3. Activity Diagram: ML Pipeline

> **Figure 5.2:** Activity Diagram: ML Pipeline-Three Parallel Machine Learning Workflows
> **Description:** Shows 3 standalone ML pipelines (Isolation Forest, Random Forest, Prophet) pulling data, calculating scores/predictions, and pushing updates back to the system.

## 3.4. Sequence Diagram

> **Figure 6:** Webhook-Driven Data Flow, ML Pipeline and Report Generation
> **Description:** Shows user journeys and interactions within 7 system components, detailing cache validation, MongoDB queries, and ML processing.

## 3.5. Class Diagram

> **Figure 7:** Webhook-Driven Data Flow, ML Pipeline and Report Generation
> **Description:** Includes eleven major entities mapping the data architecture, cron job triggers, and reporting structures.

---

# 4. DETAILED TEST PLAN

Testing happens in parallel with development. As each feature is completed it is tested prior to moving on to the next.

## 4.1. API Testing

All REST API endpoints were tested using Thunder Client on VS Code. Tests included success paths and authentication enforcement.

**Table 3: API Testing**

| METHOD & ENDPOINT | AUTH | TEST INPUT | RESPONSE | STATUS |
| --- | --- | --- | --- | --- |
| GET `/health` | None | — | 200 OK | PASS |
| GET `/health` (FastAPI :8000) | None | — | 200 OK, model loaded | PASS |
| GET `/api/analytics/kpi-summary` | JWT | All Departments | 200 OK, ten KPI values | PASS |
| GET `/api/analytics/decision-volume` | JWT | `granularity=daily` | 200 OK, count array | PASS |
| GET `/api/analytics/cycle-time-histogram` | JWT | — | 200 OK, four bucket counts | PASS |
| GET `/api/analytics/compliance-trend` | JWT | — | 200 OK, per-dept time-series | PASS |
| GET `/api/ai/anomalies` | JWT | — | 200 OK, records by severity | PASS |
| POST `/api/events/decision-update` | x-service-key | `{ newStatus: "approved", department: "CS005" }` | 200 OK, cache invalidated | PASS |
| POST `/api/events/decision-update` | Missing key | — | 401 Unauthorized | PASS |
| POST `/ml/anomaly/predict` | x-service-key | `cycleTimeHours: 3...` | 200 OK - score: 0.4085, isAnomaly: false | PASS |
| POST `/ml/anomaly/predict` | x-service-key | `cycleTimeHours: 148...` | 200 OK - score: 1.000, isAnomaly: true, Critical | PASS |
| POST `/ml/risk/score` | x-service-key | Decision features | 200 OK- risk scores | PASS |
| POST `/ml/forecast/predict` | x-service-key | `{ dept_id: 'org', horizon: 30 }` | 200 OK - forecast points | PASS |
| GET `/api/analytics/risk-heatmap` | JWT | — | 200 OK - severity counts | PASS |
| POST `/api/reports/generate` | JWT + RBAC | Report configuration | 200 OK - reportId | PASS |
| GET `/api/reports/:id/download` | JWT | Valid report ObjectId | 200 OK - streams file | PASS |
| POST `/api/reports/schedules` | JWT + RBAC | Schedule configuration | 201 Created | PASS |
| PATCH `/api/reports/schedules/:id/toggle` | JWT + RBAC | Valid schedule ObjectId | 200 OK - toggles isActive flag | PASS |
| DELETE `/api/reports/schedules/:id` | JWT + RBAC | Valid schedule ObjectId | 200 OK - `{ deleted: true }` | PASS |
| GET `/api/ai/anomalies` | No JWT | — | 401 Unauthorized | PASS |
| GET `/api/analytics/kpi-summary` | JWT (wrong role) | — | 403 Forbidden | PASS |

---

# 5. IMPLEMENTATION DETAILS

## 5.1. Pseudo Code

### 5.1.1. Pseudo Code for Dynamic KPI Aggregation Engine

```text
BEGIN
    // Retrieve relevant records based on scope
    IF departmentId refers to the entire organisation THEN
        Fetch all decisions made between startDate and endDate
        Fetch all decisions currently in a pending state
        Fetch all violations recorded between startDate and endDate
    ELSE
        Fetch decisions for the given department within the date range
        Fetch pending decisions belonging to that department
        Fetch violations for that department within the date range
    END IF
    
    // Derive basic decision counts
    Set totalDecisions   ← number of fetched decisions
    Set approvedCount    ← number of decisions whose status is "approved"
    Set rejectedCount    ← number of decisions whose status is "rejected"
    
    // Compute average processing cycle time
    Identify the subset of decisions that have a recorded completion timestamp
    For each resolved decision, note its cycle time in hours
    Set averageCycleTime ← sum of all cycle times ÷ number of resolved decisions
    
    // Compute compliance rate
    Identify decisions that were approved without exceeding the SLA deadline
    Set complianceRate   ← (count of compliant decisions ÷ totalDecisions) × 100
    
    // Count outstanding issues
    Set openViolations   ← number of violations still in an "open" state
    Set anomalyCount     ← number of detected anomalies not yet acknowledged
    
    // Determine workflow bottleneck rate
    Initialise overdueCount to zero
    FOR EACH pending decision DO
        Calculate the elapsed time since the decision was created
        Look up the SLA threshold for its category and priority level
        IF elapsed time exceeds the SLA threshold THEN
            Increment overdueCount
        END IF
    END FOR
    Set bottleneckRate ← (overdueCount ÷ totalDecisions) × 100
    
    // Persist the snapshot
    Record the snapshot for today's date, storing totalDecisions,
        approvedCount, rejectedCount, averageCycleTime, complianceRate,
        openViolations, anomalyCount, and bottleneckRate
    // If a snapshot already exists for this department and date, update it
END

```

### 5.1.2. Pseudo Code for Anomaly Detection using Isolation Forest

```text
BEGIN
    // Validate input.
    IF the decision list is empty THEN
        Return an empty result set.
    END IF
    
    // Load pre-trained artefacts.
    Retrieve the saved Isolation Forest model from persistent storage.
    Retrieve the corresponding feature scaler used during training.
    
    // Construct the feature matrix.
    FOR EACH decision in the list DO
        Extract four behavioural metrics:
            cycle time in hours, rejection count, revision count, days over SLA.
        Replace any missing metric values with zero.
        Append the metric row to the feature matrix.
    END FOR
    
    // Normalise and score.
    Apply the scaler to transform the feature matrix to the trained scale.
    Compute the raw anomaly score for every decision using the model.
    Obtain the binary prediction (normal or anomalous) for every decision.
    
    // Classify severity.
    FOR EACH decision DO
        Determine whether the model flagged it as anomalous.
        Derive a normalised score ← (0.5 − rawScore) ÷ 1.0.
        Clamp the normalised score to the range [0.0, 1.0].
        IF the decision is not anomalous THEN
            Assign severity ← "Normal".
        ELSE IF normalisedScore ≥ 0.95 THEN
            Assign severity ← "Critical".
        ELSE IF normalisedScore ≥ 0.90 THEN
            Assign severity ← "High".
        ELSE IF normalisedScore ≥ 0.80 THEN
            Assign severity ← "Medium".
        ELSE
            Assign severity ← "Low".
        END IF
        Record the decision identifier, normalised score, anomaly flag, and severity label.
    END FOR
    Return the complete list of anomaly assessments.
END

```

### 5.1.3. Pseudo Code for Risk Scoring using Random Forest

```text
BEGIN
    // Load the pre-trained classification pipeline.
    Retrieve the saved Random Forest pipeline from persistent storage.
    Extract the learned feature importance weights from the classifier.
    
    // Define the expected feature order.
    The model was trained on seven features:
        hour of day submitted, revision count, stage count,
        rejection count, cycle time in hours, department, priority.
    Align the incoming department data to match this exact column order.
    
    // Obtain class probabilities.
    Pass the aligned data through the pipeline to produce,
        for each department, a probability distribution across
        three risk classes: Low, High, and Critical.
        
    // Compute continuous risk scores and classify.
    FOR EACH department DO
        Let pLow, pHigh, and pCritical be the three class probabilities.
        
        // Interpolate a continuous risk score using weighted combination.
        Set riskScore ← (pLow × 0) + (pHigh × 66) + (pCritical × 100).
        
        // Map the continuous score to a discrete risk tier.
        IF riskScore ≥ 80 THEN
            Set riskLevel ← "Critical".
        ELSE IF riskScore ≥ 60 THEN
            Set riskLevel ← "High".
        ELSE IF riskScore ≥ 40 THEN
            Set riskLevel ← "Medium".
        ELSE
            Set riskLevel ← "Low".
        END IF
        
        // Build an interpretable importance map.
        Pair each feature name with its corresponding importance weight.
        Record the department identifier, risk score, risk level, and importance map.
    END FOR
    Return the complete list of department risk assessments.
END

```

### 5.1.4. Pseudo Code for Delay Forecasting using Facebook Prophet

```text
BEGIN
    // Validate the forecast horizon.
    IF horizon is not one of {7, 14, 30} THEN
        Display "Horizon must be 7, 14, or 30 days".
        Terminate.
    END IF
    
    // Load the department-specific Prophet model.
    Construct the model identifier from the department.
    IF no trained model exists for this department THEN
        Display "No delay model available for this department".
        Terminate.
    END IF
    Retrieve the saved Prophet model from persistent storage.
    
    // Prepare the future date range.
    Set today to the current calendar date.
    Generate a sequence of dates from today spanning the given horizon.
    
    // Execute the forecast.
    Pass the future date sequence to the Prophet model.
    Receive, for each date, a predicted delay value along with
        lower and upper confidence bounds.
        
    // Post-process the predictions.
    FOR EACH forecasted date DO
        Round the predicted value, lower bound, and upper bound
            to two decimal places.
        // A negative delay is not meaningful, so clamp to zero.
        IF predicted value < 0 THEN set predicted value ← 0. END IF
        IF lower bound < 0 THEN set lower bound ← 0. END IF
        IF upper bound < 0 THEN set upper bound ← 0. END IF
        Record the date, predicted delay, lower bound, and upper bound.
    END FOR
    Return the department identifier, the forecast horizon,
        the metric label ("delay"), and the full list of daily predictions.
END

```

## 5.2. Data Ingestion Pipeline

The Gov-Vision Analytics Module utilizes a dual source data architecture to completely segregate historical training data from live operational data.

### 5.2.1. Architecture Overview

**Table 4.1: Dual Source data pipeline (live vs training)**

|  | LIVE PIPELINE | TRAINING PIPELINE |
| --- | --- | --- |
| **Source File** | `Workflow_Optimization_Dataset_2500_Rows_v1.csv` | `bpi_aggregated_cases.csv` |
| **Import Script** | `server/scripts/importCSV.ts` | `server/scripts/importBPI.ts` |
| **Target Collection** | `m1_decisions` | `m1_training_decisions` |
| **Source Tag** | `"workflow"` | `"bpi_aggregated"` |
| **Record Count** | 2,500 rows | 31,509 rows |
| **Purpose** | Dashboard KPIs, anomaly inference, risk scoring | Training Isolation Forest, Random Forest, Prophet training Models |

### 5.2.2. Live Data Pipeline - Workflow dataset

**Table 4.2: Workflow dataset source to `m1_decisions` schema field mapping**

| CSV SOURCE COLUMN | TARGET SCHEMA FIELD | TYPE | TRANSFORMATION / DESCRIPTION |
| --- | --- | --- | --- |
| — | `decisionId` | String | Generated sequentially: `Decision_000001` … |
| Task_Type | `status` | String | "Approval" → approved; null → pending |
| Task_Start_Time | `createdAt` | Date | Parsed to ISO; linearly remapped |
| Task_End_Time | `completedAt` | Date | Derived as createdAt + BPI-scaled cycleTime |
| Actual_Time_Minutes | `cycleTimeHours` | Number | Re-centers around ~43h to match BPI model |
| Delay_Flag | `rejectionCount` | Number | isDelayed && random < 0.15 → 1–3 |
| Employee_Workload | `revisionCount` | Number | workload > 50 && random < 0.10 → 1–3 |
| — | `daysOverSLA` | Number | max(0, (cycleTimeHours − SLA_hours) / 24) |
| Approval_Level | `stageCount` | Number | "Level 1" → 1; "Level 2" → 2 |
| Department | `departmentId` | String | Normalized to canonical ID |
| Priority_Level | `priority` | String | Lowercased: low, medium, or high |

### 5.2.3. Training Data Pipeline - BPI Challenge 2017 dataset

**Table 4.3: BPI Dataset - Key Import Transformations**

| TRANSFORMATION | IMPLEMENTATION | PURPOSE |
| --- | --- | --- |
| Decision ID | `row.caseId.replace("Application_", "Decision_")` | Converts identifiers into canonical format |
| Department Assignment | `hashString(Resource) % 5` | Deterministically maps strings to FI001–CS005 |
| Date Shifting | `createdAt.setFullYear(year + 9)` | Shifts 2016–2017 dates to 2025–2026 |
| Time Compression | `cycleTimeHours / 12` | Compresses loan durations into governance ranges |
| Status Rebalancing | `balanceStatus()` | Corrects class imbalance for supervised training |

### 5.2.4. Shared Schema Contract

**Table 4.4: Shared Schema Structure of `m1_decisions` and `m1_training_decisions**`

| FIELD | TYPE | `m1_decisions` (LIVE) | `m1_training_decisions` (TRAINING) |
| --- | --- | --- | --- |
| `decisionId` | String | Decision_000001 … | Decision_652823628 |
| `status` | String | approved / rejected / pending | Rebalanced from BPI original |
| `cycleTimeHours` | Number | BPI-distribution-aligned | Compressed by 12× factor |
| `isAnomaly` | Boolean | Set by anomaly job | (not present) |
| `source` | String | `"workflow"` | `"bpi_aggregated"` |

## 5.3. Isolation Forest Model Training and Validation

Training comprises 6 steps:

1. **Data Load:** 31,509 documents loaded. Feature matrix shape is (31,509, 4).
2. **Feature Matrix:** 4 features (CycleTimeHours, rejectionCount, revisionCount, daysOverSLA).
3. **Normalization:** `fit_transform` applied with RobustScaler.
4. **Model Training:** Isolation Forest trained (`n_estimators=200`, `contamination=0.05`). 1,576 decisions flagged on training set (5.0%).
5. **Unsupervised Score Inference:** All decisions scored and normalized [0, 1].
6. **Clipping:** Values strictly clipped to maintain a 0.0000 to 1.0000 range.

> **Figure 8.1:** Training Feature Separation (Predicted Anomalies vs Normals).
> **Figure 8.2:** Training Sanity Test Cases.
> **Figure 8.3:** Training Scatter Map.

### 5.3.1. Live Data Inference Validation

**Table 5: Isolation Forest: Severity Band Distribution (Live Data)**

| SCORE BAND | SEVERITY LABEL | DECISION COUNT | PERCENTAGE | ANOMALIES FLAGGED |
| --- | --- | --- | --- | --- |
| 0.00 – 0.20 | Very Normal | 2,029 | 81.2% | 0 |
| 0.20 – 0.50 | Normal | 255 | 10.2% | 0 |
| 0.50 – 0.70 | Borderline | 157 | 6.3% | 87 |
| 0.70 – 0.80 | Low | 11 | 0.4% | 11 |
| 0.80 – 0.90 | Medium | 0 | 0.0% | 0 |
| 0.90 – 0.95 | High | 0 | 0.0% | 0 |
| 0.95 – 1.00 | Critical | 48 | 1.9% | 48 |
| **Total** |  | **2,500** | **100%** | **146 (5.8%)** |

> **Figure 8.4:** Live Data Validation: Feature Separation (Anomalies vs Normals)

## 5.4. Risk Scoring using Random Forest

**Table 6.1: Random Forest: 3 Class Risk Label Distribution (Training Data)**

| CLASS | LABEL | RULE | TRAINING COUNT | PERCENTAGE |
| --- | --- | --- | --- | --- |
| 1 | Low | `daysOverSLA == 0 AND status == "approved"` | 16,065 | 51.0% |
| 2 | High | `0 < daysOverSLA ≤ 5 OR status ≠ "rejected"` | 8,602 | 27.3% |
| 3 | Critical | `daysOverSLA > 5 OR status == "rejected"` | 6,842 | 21.7% |

**Table 6.2: Random Forest Model Output**

| PRECISION | RECALL | F1-SCORE | ACCURACY |
| --- | --- | --- | --- |
| 0.63 | 0.53 | 0.48 | 0.53 |

**Table 6.3: Random Forest Risk Classification Report (Test Set)**

| CLASS | PRECISION | RECALL | F1-SCORE | SUPPORT |
| --- | --- | --- | --- | --- |
| Low (1) | 0.73 | 0.19 | 0.31 | 3,213 |
| High (2) | 0.38 | 0.85 | 0.52 | 1,371 |
| Critical (3) | 0.67 | 0.91 | 0.77 | 1,718 |

**Table 6.4: Confusion Matrix for Critical Risk Classification**

| Predictive Values | Actual Positive | Actual Negative |
| --- | --- | --- |
| **Positive** | TP = 1571 | FP = 782 |
| **Negative** | FN = 147 | TN = 3802 |

> **Figure 9.1:** Random Forest: Confusion Matrix (3-Class)
> **Figure 9.2:** Random Forest - Top 15 Risk Drivers (Feature Importance)

## 5.5. Prophet Delay & Multi-Target Forecast

**Table 7: Prophet Delay Forecast Accuracy Metrics (80/20 Split)**

| DEPARTMENT | MAE (Hours) | RMSE (Hours) | MAPE |
| --- | --- | --- | --- |
| Operations | 5h 52m | 7h 23m | 14.17% |
| Information Technology | 9h 54m | 12h 46m | 40.65% |
| Finance | 11h 9m | 13h 16m | 41.65% |
| Customer Service | 11h 51m | 14h 14m | 41.48% |
| Human Resources | 15h 43m | 20h 10m | 52.24% |
| Organization (Aggregate) | 4h 48m | 5h 57m | 12.03% |

> **Figure 10.1:** Prophet: Org-Level Delay Forecast (90-Day Outlook)
> **Figure 10.2:** Prophet: Forecast Components (Trend, Weekly, and Yearly Seasonality)

## 5.6. Report Generation System Backend

The reporting engine generates compliance documents via three backend files following clear Separation of Concerns:

* **Data Assembly Layer:** Uses `assembleReportData()` to query `m1_decisions` and aggregate data.
* **Format Generation Layer:** Supports CSV (`json2csv`), Excel (`ExcelJS`), and PDF (`jsPDF`).
* **REST API Layer:** Four endpoints exposed to the frontend with JWT Auth and RBAC.

## 5.7. Scheduled Report Email Delivery

The report scheduling system uses Nodemailer for SMTP transport to send automated emails with signed, login-free download links and a 24-hour expiration warning.

---

# 6. RESULT AND DISCUSSION

## 6.1. Screenshots

> **Figure 11:** Analytics Dashboard: KPI cards and Charts
> **Figure 12:** Decision Analytics page
> **Figure 13:** Compliance Analytics page
> **Figure 14:** Department Performance page
> **Figure 15.1:** Anomaly Detection Page
> **Figure 15.2:** Breakdown Modal of single anomaly
> **Figure 15.3:** Breakdown of Anomaly Severity- Low
> **Figure 16:** Forecast Past- Delay Forecast
> **Figure 17.1:** Risk Score Dashboard
> **Figure 17.2:** Risk Feature Breakdown Modal
> **Figure 18.1:** Report Builder Page
> **Figure 18.2:** Report History Sub-Tab Page
> **Figure 18.3 & 18.4:** Scheduled Reports Sub-Tab Page
> **Figure 18.5:** Email Sent & Received through report Schedule
> **Figure 18.6:** Generated PDF Report (Executive Summary)

---

# 7. SUMMARY AND CONCLUSION

## 7.1. Summary of Achievement

The Analytics, Reporting & Management Monitoring System with ML Insights module for Gov-Vision delivered a real-time, event-driven executive dashboard tracking 10 governance KPIs. An Isolation Forest model detects anomalies across these metrics and surfaces them as dismissible alerts, while a Facebook Prophet forecasting pipeline produces short-, medium-, and long-term predictions for six targets. A Random Forest risk classifier processes seven governance features to generate composite risk scores. The system also includes a robust report generation engine.

## 7.2. Conclusion

The Gov-Vision Analytics, Reporting and Management Monitoring System with ML Insights operates as a governance monitoring layer that transforms raw decision life cycle data into real-time managerial insights, accessible through a unified, role-gated dashboard. Real-time KPI computation runs on an event-driven, webhook-based aggregation engine. A three-tier microservices architecture enables independent scaling, separation of concerns, and graceful degradation, shifting governance from reactive reporting to proactive management.