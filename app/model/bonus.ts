
type BonusData = {
    id: string
    EventID: number,
    ChannelID: string,
    Code: string,
    CompanyName: string,
    GDKHQDate: number, 
    NDKCCDate: number,
    Time?: number,
    Note: string,
    Name?: string,
    Exchange: string,
    DateOrder: number,  
    Rate: string,
    RateTypeID: number
  }
  
  type Bonus = {
    EventID: number,
    // ChannelID: number,
    Code: string,
    CompanyName: string,
    GDKHQDate: string, 
    NDKCCDate: string,
    // Time?: string,
    Note: string,
    // Name?: string,
    Exchange: string,
    DateOrder: string,
    Row: number,
    Rate: string,
    RateTypeID: number
  }
  