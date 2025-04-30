import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
              opacity: 0.3,
            }}
          />
          
          <div className="relative container mx-auto px-4 py-32 md:py-40 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-up">
              Ýolyňy Paýlaş<span className="text-primary">Çykdajylary Paýlaş</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl mb-8 text-muted-foreground animate-fade-up animation-delay-200">
            Siziň ugruňyza barýan sürüjiler we ýolagçylar bilen baglanşyň. Pul tyglaşyň, trafikdir azaldyň,
            we awtouluk paýlaşmak arkaly daşky gurşawy goramaga kömek ediň.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animation-delay-300">
              <Button asChild size="lg" className="px-8">
                <Link href="/register?role=driver">Ugryňy Paýlaşmak</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-8">
                <Link href="/register?role=passenger">Ugur Gözle</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Gideli Nädip işleýär</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background shadow-sm">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold text-2xl">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Ýazylmak</h3>
                <p className="text-muted-foreground">
                Sürüji ýa-da ýolagçy hökmünde hasap dörediň. Maglumatlaryňyzy giriziň we minutlarda başlaň.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background shadow-sm">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold text-2xl">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Baglanmak</h3>
                <p className="text-muted-foreground">
                Sürüjiler özleriniň ýoluny we elýeterli oturgyçlaryny ýerleşdirýärler. Ýolagçylar gerekli ýol tanyşyklaryny gözleýärler we rezerwasyon edýärler.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background shadow-sm">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold text-2xl">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Syýahat edýärsiňiz we tygşytlaýarsyňyz</h3>
                <p className="text-muted-foreground">
                  Syýahatlary we çykdajylary paýlaşyň. Sistema ähli syýahatçylaryň arasynda adalatly çykdajy paýlaryny awtomatiki hasaplaýar.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button asChild size="lg">
                <Link href="/register">Indi Başlaň</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Näme üçin Gideli-ni saýlamaly?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Pul Tygşytlaň</h3>
                <p className="text-muted-foreground">
                Ýangyç we syýahat çykdajylaryny paýlaşyň, diňe ýola çykanyňyzda pul tygşytlap, 75%-e çenli arzanladyň.
                </p>
              </div>
              
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Emissiýalary azaldyň</h3>
                <p className="text-muted-foreground">
                Ýolda az maşyn bolmagy, az täsirli zyňyndylara sebäp bolýar. Daşky gurşaw üçin öz paýyňyzy ediň.
                </p>
              </div>
              
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Täze adamlar bilen tanşyň</h3>
                <p className="text-muted-foreground">
                Öz pikirdeş syýahatçylar bilen baglanşyň we diňe ýola çykmak ýerine jemgyýetçilik ýol tanyşyklaryndan lezzet alyň.
                </p>
              </div>
              
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Trafigi azaldyň</h3>
                <p className="text-muted-foreground">
                Az maşyn bolmagy, ýollarda az gatylyk döredýär, bu bolsa ähli ýolagçylar üçin syýahat etmekde has täsirli bolýar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ýol tanyşyklaryny paýlaşmaga başlamaga taýynmy?</h2>
            <p className="max-w-2xl mx-auto text-lg mb-8 text-primary-foreground/80">
            Häzirden başlap, maşyn paýlaşmak arkaly pul tygşytlap we uglerod yzlaryny azaldan müňlerçe adamyň arasyna goşulyň.
            </p>
            <Button asChild size="lg" variant="secondary" className="px-8">
              <Link href="/register">Hesap açmak üçin mugt ýazylmak</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Car className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold">Gideli</span>
            </div>
            
            <div className="flex gap-8">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                Barada
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Hususylyk
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Şertler
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                Aragatnaşyk
              </Link>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()}  Gideli. Bütün hukuklar goralan.
          </div>
        </div>
      </footer>
    </div>
  );
}