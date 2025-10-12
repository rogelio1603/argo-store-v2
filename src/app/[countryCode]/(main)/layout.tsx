import { Metadata } from "next"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"
import WhatsAppFloatButton from "@modules/common/components/whatsapp-float-button"
import { getStoreInfo } from "@lib/data/strapi"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()

    shippingOptions = shipping_options
  }

  // Obtener número de WhatsApp desde Strapi
  const storeInfo = (await getStoreInfo())?.[0]
  const whatsappNumber = storeInfo?.whatsapp_contacto || "523330743550"

  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}
      <div className="flex-grow">
        {props.children}
      </div>
      <Footer />
      
      {/* Botón flotante de WhatsApp */}
      <WhatsAppFloatButton 
        phoneNumber={whatsappNumber}
        message="Hola, me gustaría obtener más información sobre sus productos"
      />
    </div>
  )
}
