# Тапсырыс WhatsApp-қа автомат келуі үшін баптау (~15 минут)

Схема: **Сайт → Google Apps Script → Green API → WhatsApp (+7 775 125 50 73)**

Керек: хабар **жіберетін** бөлек WhatsApp нөмірі (екінші SIM). Тапсырыс +7 775 125 50 73-ке келеді.

## 1. Green API (5 мин)
1. https://console.green-api.com — тіркеліңіз.
2. **Create instance** → тариф **Developer** (тегін).
3. Инстанс ашылған соң **QR код** шығады. Екінші SIM тұрған телефонда WhatsApp → Параметрлер → **Байланыстырылған құрылғылар** → **Құрылғы қосу** → QR-ды сканерлеңіз.
4. Статус **authorized** болуы керек.
5. Консольден үш мәнді көшіріп алыңыз: **apiUrl**, **idInstance**, **apiTokenInstance**.

## 2. Google Apps Script (7 мин)
1. https://script.google.com → **New project** (Google аккаунтпен).
2. `Code.gs` ішіндегінің бәрін өшіріп, осы реподағы `google-apps-script/Code.gs` мәтінін қойыңыз. Сақтаңыз (💾).
3. Сол жақта ⚙️ **Project Settings** → төменде **Script Properties** → **Add script property**, 4 жол қосыңыз:
   | Property | Value |
   |---|---|
   | `GREEN_API_URL` | apiUrl (мысалы `https://7105.api.greenapi.com`) |
   | `GREEN_ID` | idInstance |
   | `GREEN_TOKEN` | apiTokenInstance |
   | `ORDER_PHONE` | `77751255073` |
4. Редакторға оралып, жоғарыдан `testSend` функциясын таңдап **Run** басыңыз. Рұқсат сұрайды → Google аккаунтты таңдап → *Advanced → Go to project (unsafe)* → **Allow**.
   ✅ +7 775 125 50 73-ке «Тест хабарлама» келуі керек.
5. **Deploy → New deployment** → ⚙️ түрі **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   → **Deploy** → шыққан **Web app URL**-ді көшіріңіз (`https://script.google.com/macros/s/.../exec`).

## 3. Сайтқа қосу
`index.html` ішінде `const ORDER_ENDPOINT='';` жолына сол сілтемені қойыңыз (немесе сілтемені жіберіңіз — қойып беремін).

## Ескерту
- Green API кілттері сайтта көрінбейді, тек Google-да сақталады.
- Apps Script кодын өзгертсеңіз: Deploy → **Manage deployments** → ✏️ → Version: **New version** → Deploy (сілтеме өзгермейді).
- Жіберуші нөмір (екінші SIM) телефоны интернетсіз ұзақ тұрса да жұмыс істейді, бірақ WhatsApp-тан шығып кетпеңіз.
