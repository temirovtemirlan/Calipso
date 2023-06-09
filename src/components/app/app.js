    // app.js
    import React, { useState, useEffect, useRef } from "react";
    import Cookies from "js-cookie";

    import './app.scss'; // Main sstyles 
    import Header from "../header/";
    import About from "../about/";
    import History from "../history/";
    import Product from "../product/";
    import Catalog from "../catalog/";
    import Form from '../form/';
    import Footer from '../footer/';
    import Cart from "../cart/";
    import FixedCart from "../fixedCart/";
    import Loader from '../loader/';
    import ScrollToTopBtn from "../scrollToTopBtn/";
    import FixedHead from '../fixedMenu/';
    import FormPopup from '../FormPopup/';
    import BurgerMenu from "../burgerMenu/burgermenu";
    import CookieNotification from '../сookieNotification/сookieNotification';

    import historyImg from '../../img/historyimg.png'; 
    import fuller from '../../server/content.json';


    const App = () => {
        // state & ref, cookies
        const [showCookieNotification, setShowCookieNotification] = useState(true);
        const [opened, setOpened] = useState(false);
        const [item, setCart] = useState(Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : []);
        const [quantity, setQuantity] = useState(Cookies.get('quantity') ? JSON.parse(Cookies.get('quantity')) : 0);
        const [loader, setLoader] = useState(true);
        const [popup, setPopup ] = useState(true);
        const targetRef = useRef(null);
        const popupRef = useRef(null);
        const fixedCartRef = useRef(null);
        const catalogRef = useRef(null);

        /* закрытие popup окна */
        const handleCloseCart = () => {
            setOpened(!opened);
        }; 
        /* закрытие popup окна */
        const removeFromCart = (product) => {
            setCart(prevCart => {
                const newCart = prevCart.filter(item => item.descr !== product.descr);
                Cookies.set('cart', JSON.stringify(newCart));
                
                // Обновляем quantity и куки quantity
                let newQuantity = newCart.reduce((total, item) => total + item.quantity, 0);
                setQuantity(newQuantity);
                Cookies.set('quantity', newQuantity);
                
                return newCart;
            });
        };
        
        // ++ это увелечение кода вообщем этот участок кода отвечает за чтобы увеличивать продукцию на 1++
        const increaseQuantity = (product) => {
            addToCart(product);
            setQuantity(quantity + 1);
            Cookies.set('quantity', quantity + 1);
        };

        // -- это увелечение кода вообщем этот участок кода отвечает за чтобы увеличивать продукцию на 1--
        const decreaseQuantity = (product) => {
            setCart(prevCart => {
                const newCart = prevCart.map(item => {
                    if (item.descr === product.descr) {
                        return {...item, quantity: item.quantity - 1};
                    }
                    return item;
                }).filter(item => item.quantity > 0);
                Cookies.set('cart', JSON.stringify(newCart));
                return newCart;
            });
            setQuantity(prevQuantity => prevQuantity - 1);
            Cookies.set('quantity', quantity - 1);
        };

        // console.log(item)
        const addToCart = (product) => {
            setCart(prevCart => {
                // проверяем, есть ли уже этот товар в корзине
                const existingProduct = prevCart.find(item => item.descr === product.descr);
        
                let newCart;
                if (existingProduct) {
                    // если товар уже есть, увеличиваем его количество
                    newCart = prevCart.map(item =>
                        item.descr === product.descr ? {...item, quantity: item.quantity + 1} : item
                    );
                } else {
                    // если товара еще нет, добавляем его с количеством 1 и сохраняем изображение товара
                    newCart = [...prevCart, {...product, quantity: 1, img: product.img}];
                }

                Cookies.set('cart', JSON.stringify(newCart));
                return newCart;
            });
            setQuantity(quantity + 1);
            Cookies.set('quantity', quantity + 1);
        };

        const scrollToTarget = () => {
            if (targetRef.current) {
            targetRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }; 

        const cartClosed = () => {
            handleCloseCart();
            scrollToTarget();
        };

        const handleOrderOfProduct = () => {
            setPopup(!popup);
            setOpened(!opened);
        }

        useEffect(() => {
            const hasGivenConsent = Cookies.get("cookieConsent");
            if (hasGivenConsent) {
              setShowCookieNotification(false);
            }
        }, []);
        
        // Обработчик согласия с использованием файлов cookie
        const handleAccept = () => {
            Cookies.set("cookieConsent", true, { expires: 30 }); // Устанавливаем куки на 30 дней
            setShowCookieNotification(false);
        };

        useEffect(() => {
            const timer = setTimeout(() => {
                setLoader(false);
            }, 3000     );



            return () => clearTimeout(timer);
        }, []);

        useEffect(() => {
            if(loader) {
                document.body.style.overflowY = 'hidden';
            } else {
                document.body.style.overflowY = '';
            }
        }, [loader]);

        const handlePopupController = () => {
            setPopup(!popup);
            setOpened(!opened);

            popup ? document.querySelector("body").style.overflowY = "hidden" : document.querySelector("body").style.overflowY = ""  ;
        }

        const [ burger, setBurger ] = useState(true);

        const handleToggleBurger = () => {
            setBurger(!burger);
        }

        const scrollToCatalogs = () => {
            catalogRef.current.scrollIntoView({ behavior: 'smooth' });
        };
        
        return (
            <React.Fragment>
                {loader ? <Loader/> : null }
                <FormPopup popupRef={popupRef} quantity={quantity} popup={popup} item={item} removeFromCart={removeFromCart} handlePopupController={handlePopupController}/>
                <FixedHead burger={burger} handleToggleBurger={handleToggleBurger} cartToOpen={handleCloseCart}/>
                <Header cartToOpen={handleCloseCart} burgerToOpen={handleToggleBurger}/>
                <About id="about"/>
                <History bgColor={"#3AB8FF"} title={"история"} description={fuller.contentHistory} showButton={true} img={historyImg} />
                <Product/>
                
                <Catalog catalogRef={catalogRef} allProducts={fuller.allProducts} id="catalog" addToCart={addToCart}/>

                <History bgColor={"#6EB772"} title={"Чистая вода"} list={fuller.cleanWater} description={fuller.contentFilter} showButton={false} img={historyImg} />
                <Form id="contacts"/>
                <Footer/>
                <Cart
                    refs={fixedCartRef}
                    cartSettings={setOpened}
                    handleCloseCart={handleCloseCart}
                    opened={opened}
                    item={item}
                    removeFromCart={removeFromCart}
                    increaseQuantity={increaseQuantity}
                    decreaseQuantity={decreaseQuantity}
                    targetRef={targetRef}
                    closeCart={cartClosed}
                    scrollToTarget={scrollToTarget}
                    handleOrderOfProduct={handleOrderOfProduct}
                    />
                <FixedCart handleCloseCart={handleCloseCart} opened={opened} quantity={quantity} addToCart={addToCart}/>
                {/* <Menu bgMenu={false} fixedMenu={true} cartToOpen={handleCloseCart}/> */}
                {/* <FixedHead/> */}
                <ScrollToTopBtn/>
                {showCookieNotification && <CookieNotification acceptCookies={handleAccept} />}
                <BurgerMenu scrollToCatalog={scrollToCatalogs}  mobileCloseBurgerMenu={handleCloseCart} toggled={burger}/>
            </React.Fragment>
        )
    }

    export default App;
