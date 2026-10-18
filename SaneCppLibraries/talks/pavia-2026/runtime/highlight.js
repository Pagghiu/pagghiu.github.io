(() => {
  'use strict';
  // A small display lexer, not a C++ parser. Preserve every source character.
  const tokens = /\/\/[^\n]*|\/\*[\s\S]*?\*\/|(?:u8|u|U|L)?R"([^\s()\\]{0,16})\([\s\S]*?\)\1"|(?:u8|u|U|L)?"(?:\\.|[^"\\])*"|(?:u8|u|U|L)?'(?:\\.|[^'\\])+'|\b(?:0[xX][\da-fA-F']+|0[bB][01']+|\d[\d']*(?:\.\d+)?(?:[eE][+-]?\d+)?)[uUlLfF]*\b|\b[A-Za-z_][A-Za-z0-9_]*\b|::|->|&&|\|\||==|!=|<=|>=|\+\+|--|<<|>>|[{}()[\];,.?:~!%^&*+\-=<>#|]/g;
  const keywords = new Set(('alignas alignof and and_eq asm auto bitand bitor bool break case catch char char8_t char16_t char32_t class compl concept const consteval constexpr constinit const_cast continue co_await co_return co_yield decltype default delete do double dynamic_cast else enum explicit export extern false float for friend goto if inline int long mutable namespace new noexcept not not_eq nullptr operator or or_eq private protected public register reinterpret_cast requires return short signed sizeof static static_assert static_cast struct switch template this thread_local throw true try typedef typeid typename union unsigned using virtual void volatile wchar_t while xor xor_eq').split(' '));
  document.querySelectorAll('.source-code code').forEach(code => {
    const source=code.textContent;
    const bindings=new Map((code.closest('.source-code').dataset.bindings||'').split(/\s+/).filter(Boolean).map(x=>x.split(':')));
    const fragment=document.createDocumentFragment(),stack=[];let last=0;
    for(const match of source.matchAll(tokens)){
      fragment.appendChild(document.createTextNode(source.slice(last,match.index)));
      const value=match[0],tail=source.slice(match.index+value.length);let cls='tok-punctuation';
      if(value.startsWith('//')||value.startsWith('/*'))cls='tok-comment';
      else if(/^(?:(?:u8|u|U|L)?["']|(?:u8|u|U|L)?R")/.test(value))cls='tok-string';
      else if(bindings.has(value))cls=`code-binding bind-${bindings.get(value)}`;
      else if(/^\d/.test(value))cls='tok-number';
      else if(keywords.has(value))cls='tok-keyword';
      else if(/^[A-Z][A-Z_\d]+$/.test(value))cls='tok-macro';
      else if(/^[A-Z]/.test(value)||/^(size_t|uint\d+_t|int\d+_t|ptrdiff_t)$/.test(value))cls='tok-type';
      else if(/^[A-Za-z_]/.test(value))cls=/^\s*\(/.test(tail)?'tok-function':/^\s*::/.test(tail)?'tok-namespace':'tok-identifier';
      else if('({['.includes(value)){cls=`tok-delimiter bracket-${stack.length%3}`;stack.push(value);}
      else if(')}]'.includes(value)){if(stack.length)stack.pop();cls=`tok-delimiter bracket-${stack.length%3}`;}
      else if(!';,'.includes(value))cls='tok-operator';
      const span=document.createElement('span');span.className=cls;span.textContent=value;
      if(bindings.has(value))span.dataset.variable=value;
      fragment.appendChild(span);last=match.index+value.length;
    }
    fragment.appendChild(document.createTextNode(source.slice(last)));code.replaceChildren(fragment);
  });
})();
