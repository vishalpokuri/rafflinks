import Image from 'next/image'
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
export default function LandingPage(){
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Rafflinks
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempora cumque ullam aspernatur aliquam magnam ipsam modi velit maiores dolores harum?
                  </p>
                </div>
              </div>
              <Image
                alt="Blockchain Visualization"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height="550"
                src="/placeholder.svg"
                width="550"
                />
              <WalletMultiButton style={{ }} />
            </div>
          </div>
        </section>
      </main>
      
    </div>
  )
  
}