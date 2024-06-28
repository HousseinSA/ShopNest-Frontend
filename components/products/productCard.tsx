'use client'
import React, { useState, useRef, useEffect, MouseEventHandler } from 'react'
import { useRouter } from 'next/navigation'
import { Scaling, ShoppingCart } from 'lucide-react'
import { CldImage } from 'next-cloudinary'

import { Product as ProductData } from '@/lib/StoreTypes'
import ButtonIcon from '@/components/ui/IconButton'
import Currency from '@/components/products/currency'
import usePreviewModal from '@/lib/state/ModalState'
import useCartState from '@/lib/state/CartState'

interface Product {
  product: ProductData
}

const ProductCard: React.FC<Product> = ({ product }) => {
  const route = useRouter()
  const [animate, setAnimate] = useState(false)
  const [coords, setCoords] = useState({ startX: 0, startY: 0, endX: 0, endY: 0 })
  const imgRef = useRef<HTMLImageElement>(null)

  const onClick = () => {
    route.push(`/product/${product.id}`)
  }

  // previewModal handler state
  const { open } = usePreviewModal()
  const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation()
    open(product)
  }

  // cart handler state 
  const { addItem } = useCartState()
  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation()
    addItem(product)
    triggerAnimation()
  }

  const triggerAnimation = () => {
    if (imgRef.current) {
      const cartIcon = document.getElementById('cart-icon')
      const imgRect = imgRef.current.getBoundingClientRect()
      const cartRect = cartIcon?.getBoundingClientRect()

      if (cartRect) {
        console.log('Image Position:', imgRect)
        console.log('Cart Icon Position:', cartRect)

        setCoords({
          startX: imgRect.left,
          startY: imgRect.top,
          endX: cartRect.left,
          endY: cartRect.top
        })
        setAnimate(true)
      }
    }
  }

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setAnimate(false)
      }, 1000) // Duration of the animation
      return () => clearTimeout(timer)
    }
  }, [animate])

  return (
    <div
      onClick={onClick}
      className="rounded-xl cursor-pointer bg-white group border p-3 shadow-md relative"
    >
      <div className="aspect-square relative bg-white rounded-xl">
        <CldImage
          ref={imgRef}
          removeBackground
          fill
          src={product.images[0].url}
          alt={product.name}
          className="aspect-square object-contain object-center rounded-xl"
        />
        <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
          <div className="flex justify-center gap-x-4">
            <ButtonIcon
              icon={<Scaling size={15} color='white' />}
              onClick={onPreview}
            />
            <ButtonIcon
              onClick={onAddToCart}
              icon={<ShoppingCart size={15} color='white' />}
            />
          </div>
        </div>
      </div>
      {/* description */}
      <div>
        <p className="font-bold text-lg capitalize text-primary">
          {product.category.name}
        </p>
        <p className="text-sm font-semibold capitalize text-gray-700 m-0">
          {product.name}
        </p>
      </div>
      {/* price */}
      <Currency data={product.price} />
      {animate && (
        <div
          className="fixed w-20 h-20 bg-no-repeat bg-contain pointer-events-none"
          style={{
            zIndex:'100',
            backgroundImage: `url(${product.images[0].url})`,
            top: coords.startY,
            left: coords.startX,
            transition: 'transform 1s ease-out, opacity 1s ease-out',
            transform: `translate(${coords.endX - coords.startX}px, ${coords.endY - coords.startY}px) scale(0.1)`,
            opacity: 0
          }}
        />
      )}
    </div>
  )
}

export default ProductCard
