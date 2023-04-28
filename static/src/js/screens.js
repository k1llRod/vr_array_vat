odoo.define('ver_array_vat.PosSinPaymentScreen', function (require) {

    const PaymentScreen = require('point_of_sale.PaymentScreen');
    var models = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');
    var rpc = require('web.rpc');
    console.log('TEST PAYMENT SCREEN')

    const PosSinPaymentScreen = (PaymentScreen) =>
        class extends PaymentScreen {
            partner_nit_razon() {
                console.log('PAYMENT SCREEN');
                 $(".line_hover").hover(function(){
                    $(this).css("background-color", "white");
                    }, function(){
                    $(this).css("background-color", "#e3e3e380");
                });
                var order = this.env.pos.get_order();
                console.log('order', order);
                const partner = order.attributes.client;
                var nit_list = [];
                var nits_list = this.env.pos.get('rz_nit_lines_ids_list');
                console.log('nit_list: ',nits_list)
                for (var k = 0; k < nits_list.length; k++) {
                    if (partner.id == nits_list[k].partner_id[0]) {
                        var n_list = {
                            'id': nits_list[k].id,
                            'nit': nits_list[k].nit,
                            'razon_social': nits_list[k].razon_social,
                            'partner_id': nits_list[k].partner_id[0],
                        };
                        nit_list.push(
                            n_list,
                        );
                    }
                }
                return {'nit_razon_list': nit_list};
            }
            line_select_nit(event, $line, id) {
                console.log('line_select_nit');
                var self = this;
                var nit = $line[0].innerText;
                var cadena = nit.split("\t");
                $('.nit_ci_input').val(cadena[0]);
                $('.razon_social_input').val(cadena[1]);
            }
            constructor() {
                super(...arguments);
                var self = this;
                setTimeout(function () {
                    $('.off-order-list-contents').on('click', '.off-order-line', function (event) {
                        if (!(event.target && event.target.nodeName == 'BUTTON')) {
                            console.log("FUNCIONA");
                            self.line_select_nit(event, $(this), parseInt($(this).data('id')));
                            $('#list_rz').html($('.razon_social_input').val());
                            $('#list_nit').html($('.nit_ci_input').val());
                        }
                    });
                }, 150);
            }
         async _finalizeValidation() {
            var self = this;
            var order = this.env.pos.get_order();
            console.log('order VALIDAR', order);
            var value_bob = order.get_total_with_tax();
            console.log('value_bob', value_bob);
            var valid = 1;
            // Validar si NIT y Razon social son diferentes del cliente y registrar
            var nit_cliente = order.attributes.client.nit_ci;
            var razon_cliente = order.attributes.client.razon_social;
            var nit_ci = parseInt($('.nit_ci_input').val());
            var razon_social = $('.razon_social_input').val();
            console.log('nit_ci', nit_ci);
            if (nit_cliente != nit_ci && razon_cliente != razon_social) {
                console.log('NIT Y RAZON SOCIAL SON DIFERENTES');
                rpc.query({
                    model: 'res.partner',
                    method: 'register_nit_razon',
                    args: [{
                        'partner_id': order.attributes.client.id,
                        'nit': nit_ci,
                        'razon_social': razon_social,
                    }],
                }).then(function (result) {
                    //order.load_new_partners_nit_razon();
                    console.log("ACTUALIZAR LISTA");
                    console.log('result  ACTUALIZAR LISTA', result);
                    var fields = ['partner_id', 'nit', 'razon_social'];
                    var domain = [];
                    self.rpc({
                        model: 'rz.nit.lines',
                        method: 'search_read',
                        args: [domain, fields],
                    }, {
                        timeout: 3000,
                        shadow: true,
                    })
                        .then(function (partners) {
                            console.log('partners', partners);
                            order.pos.set({'rz_nit_lines_ids_list': partners})
                        }, function (type, err) {
                            reject();
                        });
                    console.log('RESULTADO result', result);
                });
            }
            order.get_orderlines().forEach(function (orderline) {
                if (orderline.quantity == 0) {
                    valid = 0;
                    console.log('valid', valid);
                }
            });
            if (valid == 1) {
                if (value_bob < 0) {
                    alert("No puede facturar un Pedido con monto 0");
                } else {
                    console.log('VALIDAR VENTA');
                    // this._finalize_validation_sin();
                    super._finalizeValidation();
                }
            } else {
                alert("Existe un linea con cantidad 0 Revise el pedido");
            }

        }
    };
    Registries.Component.extend(PaymentScreen, PosSinPaymentScreen);

    return PosSinPaymentScreen;

});