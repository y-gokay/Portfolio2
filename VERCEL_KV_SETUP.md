# Upstash Redis (Vercel KV) Kurulum Rehberi

Bu dosya, web sitenizi dinamik hale getirmek için Upstash Redis (Vercel KV uyumlu) kurulumunu açıklar.

**Not:** Vercel artık kendi KV servisini sunmuyor. Bunun yerine Upstash Redis kullanacağız - `@vercel/kv` paketi ile tam uyumlu!

## 1. Upstash Redis Oluşturma

1. [Vercel Dashboard](https://vercel.com/dashboard) giriş yapın
2. Projenizi seçin
3. **Storage** sekmesine gidin
4. **Create Database** butonuna tıklayın
5. **Marketplace Database Providers** bölümünde **Upstash** seçeneğini bulun
6. **Upstash** > **Redis** seçin
7. **Create Redis Database** butonuna tıklayın
8. Database'inize bir isim verin (örn: `ipekweb-redis`)
9. Ücretsiz plan seçin (Free tier)
10. Bölge seçin (EU veya US - size en yakın olanı)
11. **Create** butonuna tıklayın

Upstash Redis oluşturulduktan sonra, Vercel otomatik olarak projenize bağlayacaktır!

## 2. Environment Variables Ekleme

Upstash Redis oluşturulduktan sonra, Vercel otomatik olarak environment variable'ları ekleyecektir. Bunlar:

- `UPSTASH_REDIS_REST_URL` 
- `UPSTASH_REDIS_REST_TOKEN`

**Kodunuz zaten bu environment variable'ları otomatik olarak kullanacak şekilde yapılandırılmış!**

Upstash Redis oluşturduktan sonra:
1. Vercel Dashboard > Projeniz > Settings > Environment Variables
2. Otomatik olarak eklenmiş `UPSTASH_REDIS_REST_URL` ve `UPSTASH_REDIS_REST_TOKEN` değerlerini kontrol edin
3. Eğer eklenmemişse, Storage > Upstash Redis database'inize tıklayın
4. **Details** sekmesinden değerleri kopyalayıp manuel olarak ekleyin

**Not:** Kodunuz hem `UPSTASH_REDIS_REST_URL` hem de `KV_REST_API_URL` formatlarını destekler (geriye uyumluluk için).

## 3. Local Development İçin

Local development için `.env.local` dosyası oluşturun (proje kök dizininde):

```bash
# .env.local
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

**Alternatif olarak eski format da çalışır:**
```bash
KV_REST_API_URL=https://your-redis-instance.upstash.io
KV_REST_API_TOKEN=your-token-here
```

Bu değerleri almak için:
1. Vercel Dashboard > Storage > Upstash Redis database'inize tıklayın
2. **Details** sekmesine gidin
3. `UPSTASH_REDIS_REST_URL` ve `UPSTASH_REDIS_REST_TOKEN` değerlerini kopyalayın
4. `.env.local` dosyasına ekleyin (her iki format da çalışır)

## 4. İlk Veri Yükleme (Migration)

Mevcut statik verileri KV'ye yüklemek için:

1. Vercel'e deploy edin
2. Deploy sonrası şu URL'yi ziyaret edin:
   ```
   https://your-domain.vercel.app/api/portfolio/migrate
   ```
3. Veya terminalden:
   ```bash
   curl -X POST https://your-domain.vercel.app/api/portfolio/migrate
   ```

**Not:** Bu migration route'u sadece bir kez çalıştırılmalıdır.

## 5. Admin Paneli Kullanımı

Admin paneline erişmek için:
```
https://your-domain.vercel.app/admin
```

Admin panelinden:
- ✅ Yeni portfolio öğeleri ekleyebilirsiniz
- ✅ Mevcut öğeleri düzenleyebilirsiniz
- ✅ Öğeleri silebilirsiniz
- ✅ Tüm değişiklikler anında sitede görünür

## 6. Güvenlik

Admin paneli şifre korumalıdır. Varsayılan şifre: `admin123`

**Production için:**
1. Vercel Dashboard > Settings > Environment Variables
2. `ADMIN_PASSWORD` adında bir variable ekleyin
3. Güçlü bir şifre belirleyin
4. Varsayılan şifre (`admin123`) artık çalışmayacak

**Önemli:** Environment variable olarak `ADMIN_PASSWORD` eklemezseniz, varsayılan şifre kullanılır (güvenli değil!).

## 7. Test Etme

1. Local'de test etmek için:
   ```bash
   npm run dev
   ```
2. `.env.local` dosyasını oluşturduğunuzdan emin olun
3. `http://localhost:3000/admin` adresine gidin

## Sorun Giderme

### KV bağlantı hatası (Upstash Redis)
- Environment variable'ların doğru eklendiğinden emin olun (`UPSTASH_REDIS_REST_URL` ve `UPSTASH_REDIS_REST_TOKEN`)
- Vercel Dashboard'dan Upstash Redis veritabanının aktif olduğunu kontrol edin
- Upstash Dashboard'dan (https://console.upstash.com) database'inizin çalıştığından emin olun
- Environment variable'ların Vercel'de otomatik eklendiğini kontrol edin (Storage > Upstash Redis > Details)
- **Not:** Kodunuz hem `UPSTASH_REDIS_REST_URL` hem de `KV_REST_API_URL` formatlarını destekler - her ikisi de çalışır!

### Migration hatası
- Upstash Redis veritabanının oluşturulduğundan emin olun
- Environment variable'ların (`UPSTASH_REDIS_REST_URL` ve `UPSTASH_REDIS_REST_TOKEN`) Vercel'de deploy edildiğini kontrol edin
- Upstash Redis'in aktif ve çalışır durumda olduğundan emin olun
- Migration endpoint'ini sadece bir kez çağırdığınızdan emin olun

### Admin paneli çalışmıyor
- API route'larının çalıştığını kontrol edin (`/api/portfolio`)
- Browser console'da hata mesajlarını kontrol edin

