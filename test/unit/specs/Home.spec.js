// import Vue from 'vue';
import Home from '@/components/Home';

describe( 'Home.vue', () => {
  /* it( 'Should get the main title correctly', () => {
    const Constructor = Vue.extend( Home );
    const vm = new Constructor().$mount();
    expect( vm.$el.querySelector( 'li.img span' ).textContent )
      .to.equal( 'Mis puntos' );
  } ); */

  it( 'Should get the title var correctly', () => {
    expect( Home.data().title ).to.equal( 'Mis puntos' );
  } );

  it( 'Has a mounted() hook', () => {
    expect( Home.mounted ).to.be.a( 'function' );
  } );

  it( 'Has tableData as var', () => {
    expect( Home.data ).to.be.a( 'function' );
    expect( Home.data().tableData ).to.equal( null );
  } );
} );
