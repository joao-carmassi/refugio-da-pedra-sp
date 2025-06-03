'use client';

// import parceiros from '@/data/parceiros.json';
import chales from '@/data/chales.json';
import { ptBR } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ArrowRightIcon, Calendar as CalendarIcon } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import formataData from '@/utils/formataData';

const formSchema = z.object({
  nome: z.string(),
  checkin: z.coerce.date(),
  checkout: z.coerce.date(),
  adultos: z.coerce.number().min(1).max(9),
  criancas: z.coerce.number().max(9).optional(),
  pets: z.coerce.number().max(9).optional(),
  chale: z.string(),
  parceiros: z.array(z.string()).optional(),
});

export default function FormularioDeReserva() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    const partesExtras: string[] = [];

    if ((data.criancas as number) >= 1) {
      partesExtras.push(`🧒 *Crianças:* ${data.criancas}`);
    }
    if ((data.pets as number) >= 1) {
      partesExtras.push(`😸 *Pets:* ${data.pets}`);
    }

    let mensagem = `✨ *Nova Reserva* ✨

👤 *Nome:* ${data.nome}
🏡 *Chalé:* ${data.chale}

📅 *Check-in:* ${formataData(data.checkin)}
📅 *Check-out:* ${formataData(data.checkout)}

👥 *Adultos:* ${data.adultos}`;

    if (partesExtras.length > 0) {
      mensagem += `\n${partesExtras.join('\n')}`;
    }

    if (data.parceiros && data.parceiros.length > 0) {
      mensagem += `

🎯 *Atividades:* ${data.parceiros.join(', ')}`;
    }

    mensagem += `

Por favor, me confirme a disponibilidade. Obrigado! 😊`;

    window.open(
      `https://api.whatsapp.com/send?phone=5512996148154&text=${encodeURIComponent(
        mensagem
      )}`,
      '_blank'
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-6"
      >
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  className="bg-background text-foreground border border-border shadow-none"
                  placeholder="Digite seu nome"
                  type="text"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>Insira seu nome</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="checkin"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Check-in</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                            form.formState.errors.checkin
                              ? 'border-red-600'
                              : ''
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP', { locale: ptBR })
                          ) : (
                            <span>Escolha uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Insira sua data de chegada</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="checkout"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Check-out</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                            form.formState.errors.checkout
                              ? 'border-red-600'
                              : ''
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP', { locale: ptBR })
                          ) : (
                            <span>Escolha uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Insira sua data de saída</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="adultos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adultos</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o número de adultos"
                      type="number"
                      className="bg-background text-foreground border border-border shadow-none"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormDescription>Insira o numero de adultos</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="criancas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crianças</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o número de crianças"
                      type="number"
                      className="bg-background text-foreground border border-border shadow-none"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormDescription>Insira o numero de crianças</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="pets"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pets</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o numero de animais de estimação"
                  type="number"
                  className="bg-background text-foreground border border-border shadow-none"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>
                Insira o numero de animais de estimação
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="chale"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Chalé</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl
                    className={`bg-background text-foreground border border-border shadow-none ${
                      form.formState.errors.chale ? 'border-red-600' : ''
                    }`}
                  >
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-[200px] justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? chales.find((chale) => chale.nome === field.value)
                            ?.nome
                        : 'Selecione um chalé'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Procure o chalé..." />
                    <CommandList>
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup>
                        {chales.map((chale) => (
                          <CommandItem
                            value={chale.nome}
                            key={chale.nome}
                            onSelect={() => {
                              form.setValue('chale', chale.nome);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                chale.nome === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {chale.nome}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Selecione seu chalé de interesse
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="parceiros"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complete sua experiência</FormLabel>
              <FormControl>
                <MultiSelector
                  values={field.value || []}
                  onValuesChange={field.onChange}
                  loop
                >
                  <MultiSelectorTrigger className="bg-background text-foreground border border-border text-sm">
                    <MultiSelectorInput placeholder="Agende um passeio" />
                  </MultiSelectorTrigger>
                  <MultiSelectorContent>
                    <MultiSelectorList>
                      {parceiros.map((parceiro) => (
                        <MultiSelectorItem
                          key={parceiro.title}
                          value={parceiro.title}
                        >
                          {parceiro.title}
                        </MultiSelectorItem>
                      ))}
                    </MultiSelectorList>
                  </MultiSelectorContent>
                </MultiSelector>
              </FormControl>
              <FormDescription>
                Deseja reservar com algum parceiro?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <div className="flex items-center gap-3">
          <Button
            className="tracking-wide w-full flex-1"
            variant="default"
            size="lg"
            effect="expandIcon"
            icon={ArrowRightIcon}
            iconPlacement="right"
            type="submit"
          >
            Reservar
          </Button>
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="text-sm tracking-wide flex-1"
          >
            <a href="https://api.whatsapp.com/send?phone=5512996148154&text=Ola, vim pelo site da pousada e gostaria de fazer uma reserva">
              Pular formulario
            </a>
          </Button>
        </div>
      </form>
    </Form>
  );
}
