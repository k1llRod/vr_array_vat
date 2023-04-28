odoo.define('vr_array_vat.ProductScreen', function (require) {
    'use strict';

    const Registries = require('point_of_sale.Registries');
    var models = require('point_of_sale.models');
    const ProductScreen = require('point_of_sale.ProductScreen');
    var rpc = require('web.rpc');

    console.log('PRODUCT SCREEN');

    const OffProductScreen = (ProductScreen) =>
        class extends ProductScreen {
            async _onClickPay() {
                var order = this.env.pos.get_order().attributes.client;
                console.log(this.env.pos.get_order().attributes.client);
                if(order == null){
                    return this.showPopup('ErrorPopup', {
                      title: ('Elegir cliente'),
                    });
                }else{
                    super._onClickPay();
                }
            }
        }
    Registries.Component.extend(ProductScreen, OffProductScreen);
    return ProductScreen;
});