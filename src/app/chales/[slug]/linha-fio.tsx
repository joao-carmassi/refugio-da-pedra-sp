/**
 * Fio de 1px + item. Substitui o bullet `list-disc`, que é voz de documento e
 * não de revista. Compartilhado por `ideal-para.tsx` e `comodidades.tsx` para
 * que as duas listas da página tenham exatamente o mesmo ritmo.
 */
function LinhaFio({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <li className="border-t border-border py-2.5 text-sm leading-snug text-muted-foreground">
      {children}
    </li>
  );
}

export default LinhaFio;
